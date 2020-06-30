type VirtualElement = {
  type: string
  props: {
    [propName: string]: any
    children: (VirtualElement | VirtualTextElement)[]
  }
}

type VirtualTextElement = {
  type: 'TEXT_ELEMENT'
  props: {
    nodeValue: string
  }
}

function createElement(type: string, props: any = null, ...children: any[]): VirtualElement | VirtualTextElement {
  return {
    type,
    props: {
      ...props,
      children: children.map((child) => {
        if (typeof child === 'object') return child
        if (typeof child === 'string' || child === 'number') return createTextElement(child)
        throw Error('Child is not object, string or number.')
      }),
    },
  }
}

function createTextElement(text: string): VirtualTextElement {
  return {
    type: 'TEXT_ELEMENT',
    props: {
      nodeValue: text,
    },
  }
}

function isTextNode(e: VirtualElement | VirtualTextElement): e is VirtualTextElement {
  return e.type === 'TEXT_ELEMENT'
}

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
