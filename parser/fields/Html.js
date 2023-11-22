import { has, each, toObj, isArr } from '../../fnlib'
import base from './Base'
import { createNode } from './Node'
import { createLink } from './Link'

function createNodes(nodes) {
  const res = []
  each(nodes, (fragment) => {
    if (has(fragment, 'value') && isArr(fragment.value)) {
      fragment.value = createNodes(fragment.value)
    }
    if (has(fragment, 'elem') && fragment.elem === 'a') {
      res.push(createLink(fragment))
    } else {
      res.push(createNode(fragment))
    }
  })
  return res
}

export function createHtml(obj) {
  const functions = {

    // unlike in Node, the functions _tag() and _str() both return the same,
    // because this object is a representation of the writer-field and 
    // _value holds only a collection of html-nodes.
    // Other functions like _attr() don't make sense here.
    _tag(options) {
      return this._str(options)
    },
    _str(options) {
      const res = []
      each(this._value, (node) => {
        res.push(node._tag(options))
      })
      return res.join('')
    },
  }
  
  const data = {
    _type: 'html',
    _value: createNodes(isArr(obj.value) ? obj.value : [ obj.value ]),
  }
  return toObj(base, functions, data)
}