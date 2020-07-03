import { VirtualElement, createElement } from './element'

type Fiber = {
  type: string // FIXME
  dom: HTMLElement | Text | null
  props: VirtualElement['props']
  parent: Fiber | null
  child?: Fiber
  sibling?: Fiber
}

// FIXME
let nextUnitOfWork: Fiber | null = null
window.requestIdleCallback(workLoop)

function workLoop(deadline: RequestIdleCallbackDeadline) {
  let shouldYield = false
  while (nextUnitOfWork && !shouldYield) {
    nextUnitOfWork = performUnitOfWork(nextUnitOfWork)
    shouldYield = deadline.timeRemaining() < 1
  }
  window.requestIdleCallback(workLoop)
}

function performUnitOfWork(fiber: Fiber): Fiber | null {
  if (!fiber.dom) {
    fiber.dom = createDom(fiber)
  }

  if (fiber.parent) {
    fiber.parent.dom!.appendChild(fiber.dom) // A parent must have dom.
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
  if (fiber.type === 'TEXT_ELEMENT') {
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

function render(element: VirtualElement, container: HTMLElement) {
  nextUnitOfWork = {
    dom: container,
    parent: null,
    type: 'ELEMENT', // FIXME
    props: {
      children: [element],
    },
  }
}

const Didact = {
  createElement,
  render,
}

export default Didact
