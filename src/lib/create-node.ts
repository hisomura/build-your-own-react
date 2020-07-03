export type VirtualElement = {
  type: string
  props: {
    [propName: string]: any
    children: VirtualNode[]
  }
}

export type VirtualText= {
  type: 'TEXT_ELEMENT'
  props: {
    nodeValue: string
  }
}

export type VirtualNode = VirtualElement | VirtualText

export function createElement(type: string, props: any = null, ...children: any[]): VirtualNode {
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

export function createTextElement(text: string): VirtualText {
  return {
    type: 'TEXT_ELEMENT',
    props: {
      nodeValue: text,
    },
  }
}

export function isTextNode(e: VirtualNode): e is VirtualText {
  return e.type === 'TEXT_ELEMENT'
}
