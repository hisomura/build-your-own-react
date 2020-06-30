import './index.css'
import Didact from './lib/diadact'

const element = (
  <div id="foo">
    <a>bar</a>
    <b />
  </div>
)
console.log('hello, world')
console.log(element)

const container = document.getElementById("root")
Didact.render(element, container)
