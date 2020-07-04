import './index.css'
import Didact from './lib/diadact'

// const element = (
//   <div id="foo">
//     <a>bar</a>
//     <b />
//   </div>
// )
// console.log('hello, world')
// console.log(element)
//
// const container = document.getElementById("root")
// if (!container) throw new Error('no root.')
// Didact.render(element, container)

const container = document.getElementById("root")

// @ts-ignore
const updateValue = e => {
  rerender(e.target!.value)
}

// @ts-ignore
const rerender = value => {
  const element = (
    <div>
      <input onInput={updateValue} value={value} />
      <h2>Hello {value}</h2>
    </div>
  )
  Didact.render(element, container!)
}

rerender("World")
