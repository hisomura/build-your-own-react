import Didact from './diadact'

test('<div/> returns expected element', () => {
  const element = Didact.createElement('div')
  expect(element).toEqual({
    type: 'div',
    props: { children: [] },
  })
})

test('<div id="foo" /> returns expected element', () => {
  const element = Didact.createElement('div', { id: 'foo' })
  expect(element).toEqual({
    type: 'div',
    props: { id: 'foo', children: [] },
  })
})

test('<a>link</a> returns text element', () => {
  const childElement = Didact.createElement('a', null, 'bar')

  expect(childElement).toEqual({
    type: 'a',
    props: {
      children: [{ props: { nodeValue: 'bar' }, type: 'TEXT_ELEMENT' }],
    },
  })
})

test('<div id="foo"><a>link</a></div> returns expected element', () => {
  const childElement = Didact.createElement('a', null, 'bar')
  const element = Didact.createElement('div', { id: 'foo' }, childElement)
  expect(element).toEqual({
    type: 'div',
    props: { id: 'foo', children: [childElement] },
  })
})
