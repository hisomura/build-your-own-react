export type VirtualHtmlElement = {
  type: string
  props: {
    [propName: string]: any
    children: (VirtualHtmlElement | VirtualTextElement)[]
  }
}

export type VirtualTextElement = {
  type: 'TEXT_ELEMENT'
  props: {
    nodeValue: string
  }
}

export type VirtualElement = VirtualHtmlElement | VirtualTextElement

export function createElement(type: string, props: any = null, ...children: any[]): VirtualElement {
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

export function createTextElement(text: string): VirtualTextElement {
  return {
    type: 'TEXT_ELEMENT',
    props: {
      nodeValue: text,
    },
  }
}

export function isTextNode(e: VirtualElement): e is VirtualTextElement {
  return e.type === 'TEXT_ELEMENT'
}
