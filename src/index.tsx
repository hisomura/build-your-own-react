import './index.css'
import Didact from './lib/diadact'

function App(props: { name: string }) {
  return <h1>Hi {props.name}</h1>
}

function Random() {
  if (Math.floor(Math.random() * 2) === 0) {
    return null
  }
  return <p>foobar</p>
}

function Counter() {
  const [state, setState] = Didact.useState(1)
  return <h1 onclick={() => setState((c: number) => c + 1)}>count: {state}</h1>
}

const element = (
  <div id="foo">
    <a>bar</a>
    <Random />
    <Counter />
    <App name="foo" />
  </div>
)

const container = document.getElementById('root')
if (!container) throw new Error('no root.')
Didact.render(element, container)

// const container = document.getElementById("root")
//
// // @ts-ignore
// const updateValue = e => {
//   rerender(e.target!.value)
// }
//
// // @ts-ignore
// const rerender = value => {
//   const element = (
//     <div>
//       <input onInput={updateValue} value={value} />
//       <h2>Hello {value}</h2>
//     </div>
//   )
//   Didact.render(element, container!)
// }
//
// rerender("World")
