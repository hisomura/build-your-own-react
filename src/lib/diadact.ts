function createElement(type: string, props: any, ...children: any[]) {
  return {
    type,
    props: {
      ...props,
      children,
    },
    children: children.map(child => {
      if (typeof child === 'object' ) return child
      if (typeof child === 'string' || child === 'number' ) return createTextElement(child)
      throw Error('Child is not object, string or number.' )
    })
  }
}

function createTextElement(text: string) {
  return {
    type: "TEXT_ELEMENT",
    props: {
      nodeValue: text,
      children: []
    }
  }
}

const Didact = {
  createElement
}

export default Didact
