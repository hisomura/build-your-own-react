import { VirtualElement, VirtualTextElement, isTextNode, createElement } from './element'

function render(element: VirtualElement | VirtualTextElement, container: HTMLElement | null) {
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

const Didact = {
  createElement,
  render,
}

export default Didact
