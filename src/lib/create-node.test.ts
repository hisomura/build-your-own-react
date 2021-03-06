import { createElement } from './create-node'

test('<div/> returns expected element', () => {
  const element = createElement('div')
  expect(element).toEqual({
    type: 'div',
    props: { children: [] },
  })
})

test('<div id="foo" /> returns expected element', () => {
  const element = createElement('div', { id: 'foo' })
  expect(element).toEqual({
    type: 'div',
    props: { id: 'foo', children: [] },
  })
})

test('<a>link</a> returns text element', () => {
  const childElement = createElement('a', null, 'bar')

  expect(childElement).toEqual({
    type: 'a',
    props: {
      children: [{ props: { nodeValue: 'bar' }, type: 'TEXT' }],
    },
  })
})

test('<div id="foo"><a>link</a></div> returns expected element', () => {
  const childElement = createElement('a', null, 'bar')
  const element = createElement('div', { id: 'foo' }, childElement)
  expect(element).toEqual({
    type: 'div',
    props: { id: 'foo', children: [childElement] },
  })
})

test('number is converted to string', () => {
  const childElement = createElement('div', null, 1)

  expect(childElement).toEqual({
    type: 'div',
    props: {
      children: [{ props: { nodeValue: '1' }, type: 'TEXT' }],
    },
  })
})
