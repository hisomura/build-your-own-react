import { VirtualNode, createElement } from './create-node'

type Fiber = {
  type: string | Function
  dom: HTMLElement | Text | null
  props: VirtualNode['props']
  parent: Fiber | null
  child?: Fiber
  sibling?: Fiber
  alternate?: Fiber | null
  effectTag?: 'UPDATE' | 'PLACEMENT' | 'DELETION'
}

let nextUnitOfWork: Fiber | null = null
let wipRoot: Fiber | null = null
let currentRoot: Fiber | null = null
let deletions: Fiber[] | null = null
window.requestIdleCallback(workLoop)

function workLoop(deadline: RequestIdleCallbackDeadline) {
  let shouldYield = false
  while (nextUnitOfWork && !shouldYield) {
    nextUnitOfWork = performUnitOfWork(nextUnitOfWork)
    shouldYield = deadline.timeRemaining() < 1
  }

  if (!nextUnitOfWork && wipRoot) {
    commitRoot()
  }

  window.requestIdleCallback(workLoop)
}

function performUnitOfWork(fiber: Fiber): Fiber | null {
  if (fiber.type instanceof Function) {
    updateFunctionComponent(fiber)
  } else {
    updateHostComponent(fiber)
  }

  if (fiber.child) {
    return fiber.child
  }
  let nextFiber: Fiber | null = fiber
  while (nextFiber) {
    if (nextFiber.sibling) {
      return nextFiber.sibling
    }
    nextFiber = nextFiber.parent
  }

  return null
}

function updateFunctionComponent(fiber: Fiber) {
  const child = (fiber.type as Function)(fiber.props)
  if (!child) return

  reconcileChildren(fiber, [child])
}

function updateHostComponent(fiber: Fiber) {
  if (!fiber.dom) {
    fiber.dom = createDom(fiber)
  }

  if ('children' in fiber.props) {
    reconcileChildren(fiber, fiber.props.children)
  }
}

function reconcileChildren(wipFiber: Fiber, elements: VirtualNode[]) {
  let oldFiber = wipFiber.alternate?.child
  let prevSibling: Fiber | null = null

  for (let i = 0; i < elements.length || oldFiber; i += 1) {
    const element = elements[i]
    let newFiber: Fiber

    const sameType = oldFiber && element.type === oldFiber.type
    if (sameType) {
      newFiber = {
        type: oldFiber!.type,
        props: element.props,
        dom: oldFiber!.dom,
        parent: wipFiber,
        alternate: oldFiber,
        effectTag: 'UPDATE',
      }
    } else {
      newFiber = {
        type: element.type,
        props: element.props,
        dom: null,
        parent: wipFiber,
        alternate: null,
        effectTag: 'PLACEMENT',
      }

      if (oldFiber) {
        oldFiber.effectTag = 'DELETION'
        deletions?.push(oldFiber)
      }
    }
    // TODO key check like React

    if (oldFiber) {
      oldFiber = oldFiber.sibling
    }

    if (!prevSibling) {
      wipFiber.child = newFiber
    } else {
      prevSibling.sibling = newFiber
    }

    prevSibling = newFiber
  }
}

function createDom(fiber: Fiber) {
  if (fiber.type === 'TEXT') {
    return document.createTextNode('' + fiber.props.nodeValue)
  }

  const dom = document.createElement('' + fiber.type)
  updateDom(dom, { children: [] }, fiber.props)

  return dom
}

function commitRoot() {
  deletions?.forEach(commitWork)
  if (wipRoot?.child) {
    commitWork(wipRoot.child)
  }
  currentRoot = wipRoot
  wipRoot = null
}

function commitWork(fiber: Fiber) {
  let domParentFiber = fiber.parent!
  while (!domParentFiber.dom) {
    domParentFiber = domParentFiber.parent!
  }

  // @ts-ignore FIXME
  const domParent = domParentFiber.dom

  // FIXME remove null check
  if (fiber.effectTag === 'PLACEMENT' && fiber.dom !== null) {
    // @ts-ignore FIXME
    domParent.appendChild(fiber.dom)
  } else if (fiber.effectTag === 'UPDATE' && fiber.dom !== null) {
    updateDom(fiber.dom, fiber.alternate!.props, fiber.props)
  } else if (fiber.effectTag === 'DELETION') {
    commitDeletion(fiber, domParent)
  }

  if (fiber.child) commitWork(fiber.child)
  if (fiber.sibling) commitWork(fiber.sibling)
}

function commitDeletion(fiber: Fiber, domParent: HTMLElement | Text) {
  if (fiber.dom) {
    // @ts-ignore FIXME
    domParent.removeChild(fiber.dom!)
  } else {
    if (fiber.child) commitDeletion(fiber.child, domParent)
  }
}

const isProperty = (key: string) => key !== 'children' && !isEvent(key)
const isEvent = (key: string) => key.startsWith('on')
const isNew = (prev: any, next: any) => (key: string) => prev[key] !== next[key]
const isGone = (next: { [propName: string]: any }) => (key: string) => !(key in next)
function updateDom(dom: HTMLElement | Text, prevProps: Fiber['props'], nextProps: Fiber['props']) {
  // Remove old listeners
  Object.keys(prevProps)
    .filter(isEvent)
    .filter((key) => !(key in nextProps) || isNew(prevProps, nextProps)(key))
    .forEach((name) => {
      const eventType = name.toLowerCase().substring(2)
      const listener = prevProps[name as keyof typeof prevProps]
      if (typeof listener !== 'function') return
      dom.removeEventListener(eventType, listener)
    })

  // Remove old properties
  Object.keys(prevProps)
    .filter(isProperty)
    .filter(isGone(nextProps))
    .forEach((name) => {
      // @ts-ignore
      dom[name] = ''
    })

  // Set new or changed properties
  Object.keys(nextProps)
    .filter(isProperty)
    .filter(isNew(prevProps, nextProps))
    .forEach((name) => {
      // @ts-ignore
      dom[name] = nextProps[name]
    })

  // Set new or changed listeners
  Object.keys(nextProps)
    .filter(isEvent)
    .filter(isNew(prevProps, nextProps))
    .forEach((name) => {
      const eventType = name.toLowerCase().substring(2)
      const listener = nextProps[name as keyof typeof nextProps]
      if (typeof listener !== 'function') return
      dom.addEventListener(eventType, listener)
    })
}

function render(element: VirtualNode, container: HTMLElement) {
  wipRoot = {
    dom: container,
    parent: null,
    type: 'ROOT',
    props: {
      children: [element],
    },
    alternate: currentRoot,
  }
  deletions = []
  nextUnitOfWork = wipRoot
}

const Didact = {
  createElement,
  render,
}

export default Didact
