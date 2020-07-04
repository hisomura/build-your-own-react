import { VirtualNode, createElement } from './create-node'

type Fiber = {
  type: string // FIXME
  dom: HTMLElement | Text | null
  props: VirtualNode['props']
  parent: Fiber | null
  child?: Fiber
  sibling?: Fiber
}

// FIXME
let nextUnitOfWork: Fiber | null = null
let wipRoot: Fiber | null = null
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
    const elements = fiber.props.children
    let prevSibling: Fiber | null = null

    for (let i = 0; i < elements.length; i += 1) {
      const element = elements[i]
      const newFiber: Fiber = {
        type: element.type,
        parent: fiber,
        dom: null,
        props: element.props,
      }

      if (!prevSibling) {
        fiber.child = newFiber
      } else {
        prevSibling.sibling = newFiber
      }

      prevSibling = newFiber
    }
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

function createDom(fiber: Fiber) {
  // FIXME
  if (fiber.type === 'TEXT') {
    return document.createTextNode(fiber.props.nodeValue)
  }

  const dom = document.createElement(fiber.type)
  const isProperty = (key: string) => key !== 'children'

  Object.keys(fiber.props)
    .filter(isProperty)
    .forEach((name) => {
      // FIXME ts-ignore
      // @ts-ignore
      dom[name] = fiber.props[name]
    })

  return dom
}

function commitRoot() {
  if (wipRoot?.child) {
    commitWork(wipRoot.child)
  }
  wipRoot = null
}

function commitWork(fiber: Fiber) {
  const domParent = fiber.parent!.dom! // fiber must have parent.
  domParent.appendChild(fiber.dom!)
  if (fiber.child) commitWork(fiber.child)
  if (fiber.sibling) commitWork(fiber.sibling)
}

function render(element: VirtualNode, container: HTMLElement) {
  wipRoot = {
    dom: container,
    parent: null,
    type: 'ELEMENT', // FIXME
    props: {
      children: [element],
    },
  }
  nextUnitOfWork = wipRoot
}

const Didact = {
  createElement,
  render,
}

export default Didact
