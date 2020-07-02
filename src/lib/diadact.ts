import { VirtualElement, isTextNode, createElement } from './element'

function render(element: VirtualElement, container: HTMLElement | null) {
  if (isTextNode(element)) {
    container?.appendChild(document.createTextNode(element.props.nodeValue))
    return
  }

  const dom = document.createElement(element.type)
  const isProperty = (key: string) => key !== 'children'
  Object.keys(element.props)
    .filter(isProperty)
    .forEach((name) => {
      if (name === 'id') {
        dom[name] = element.props[name] // FIXME
      }
    })

  element.props.children.forEach((child) => {
    render(child, dom)
  })

  container?.appendChild(dom)
}

let nextUnitOfWork: string | null | void = null

function workLoop(deadline: RequestIdleCallbackDeadline) {
  let shouldYield = false
  while (nextUnitOfWork && !shouldYield) {
    nextUnitOfWork = performUnitOfWork(nextUnitOfWork)
    shouldYield = deadline.timeRemaining() < 1
  }
  window.requestIdleCallback(workLoop)
}
window.requestIdleCallback(workLoop)

function performUnitOfWork(nextUnitOfWork: any) {
  // TODO
}

const Didact = {
  createElement,
  render,
}

export default Didact
