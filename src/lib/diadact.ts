import { VirtualNode, createElement } from './create-node'

type Fiber = {
  type: string // FIXME
  dom: HTMLElement | Text | null
  props: VirtualNode['props']
  parent: Fiber | null
  child?: Fiber
  sibling?: Fiber
  alternate?: Fiber | null
  effectTag?: 'UPDATE' | 'PLACEMENT' | 'DELETION'
}

// FIXME
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
  if (!fiber.dom) {
    fiber.dom = createDom(fiber)
  }

  if ('children' in fiber.props) {
    reconcileChildren(fiber, fiber.props.children)
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
    }
    if (!sameType) {
      newFiber = {
        type: element.type,
        props: element.props,
        dom: null,
        parent: wipFiber,
        alternate: null,
        effectTag: 'PLACEMENT',
      }
    }
    if (oldFiber && !sameType) {
      oldFiber.effectTag = 'DELETION'
      deletions?.push(oldFiber)
    }
    // TODO key check like React

    if (oldFiber) {
      oldFiber = oldFiber.sibling
    }

    // FIXME newFiber!
    if (!prevSibling) {
      wipFiber.child = newFiber!
    } else {
      prevSibling.sibling = newFiber!
    }

    prevSibling = newFiber!
  }
}

function createDom(fiber: Fiber) {
  // FIXME
  if (fiber.type === 'TEXT') {
    return document.createTextNode(fiber.props.nodeValue)
  }

  const dom = document.createElement(fiber.type)
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
  const domParent = fiber.parent!.dom! // fiber must have parent.

  // FIXME remove null check
  if (fiber.effectTag === 'PLACEMENT' && fiber.dom !== null) {
    domParent.appendChild(fiber.dom)
  } else if (fiber.effectTag === 'UPDATE' && fiber.dom !== null) {
    updateDom(fiber.dom, fiber.alternate!.props, fiber.props)
  } else if (fiber.effectTag === 'DELETION') {
    domParent.removeChild(fiber.dom!)
  }

  domParent.appendChild(fiber.dom!)
  if (fiber.child) commitWork(fiber.child)
  if (fiber.sibling) commitWork(fiber.sibling)
}

const isProperty = (key: string) => key !== 'children' && !isEvent(key)
const isEvent = (key: string) => key.startsWith('on')
const isNew = (prev: any, next: any) => (key: string) => prev[key] !== next[key]
const isGone = (next: { [propName: string]: any }) => (key: string) => !(key in next)
function updateDom(dom: Fiber['dom'], prevProps: Fiber['props'], nextProps: Fiber['props']) {
  Object.keys(prevProps)
    .filter(isEvent)
    .filter((key) => !(key in nextProps) || isNew(prevProps, nextProps)(key))
    .forEach((name) => {
      const eventType = name.toLowerCase().substring(2)

      // FIXME ts-ignore
      // @ts-ignore
      dom!.removeEventListener(eventType, prevProps[name])
    })

  // Remove old properties
  Object.keys(prevProps)
    .filter(isProperty)
    .filter(isGone(nextProps))
    .forEach((name) => {
      // FIXME ts-ignore
      // @ts-ignore
      dom[name] = ''
    })

  // Set new or changed properties
  Object.keys(nextProps)
    .filter(isProperty)
    .filter(isNew(prevProps, nextProps))
    .forEach((name) => {
      // FIXME ts-ignore
      // @ts-ignore
      dom[name] = nextProps[name]
    })

  Object.keys(nextProps)
    .filter(isEvent)
    .filter(isNew(prevProps, nextProps))
    .forEach((name) => {
      const eventType = name.toLowerCase().substring(2)

      // FIXME ts-ignore
      // @ts-ignore
      dom!.addEventListener(eventType, nextProps[name])
    })
}

function render(element: VirtualNode, container: HTMLElement) {
  wipRoot = {
    dom: container,
    parent: null,
    type: 'ELEMENT', // FIXME
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
