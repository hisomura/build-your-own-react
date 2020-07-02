export type VirtualElement = {
  type: string
  props: {
    [propName: string]: any
    children: (VirtualElement | VirtualTextElement)[]
  }
}

export type VirtualTextElement = {
  type: 'TEXT_ELEMENT'
  props: {
    nodeValue: string
  }
}

export function createElement(type: string, props: any = null, ...children: any[]): VirtualElement | VirtualTextElement {
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

export function isTextNode(e: VirtualElement | VirtualTextElement): e is VirtualTextElement {
  return e.type === 'TEXT_ELEMENT'
}
