import { has, each, toObj, isArr } from '../../fnlib'
import base from './Base'
import { createHtmlNode } from './HtmlNode'

/**
 * Recoursive function to create HtmlNodes from html field value.
 * 
 * @param array nodes 
 * @returns object
 */
function createNodes(nodes) {
  const res = []
  each(nodes, (fragment) => {
    if (has(fragment, 'value') && isArr(fragment.value)) {
      fragment.value = createNodes(fragment.value)
    }
    res.push(createHtmlNode(fragment))
  })
  return res
}

/**
 * Model for API field: html
 * 
 * @param {object} obj the field data
 * @returns {object}
 */
export function createHtml(obj) {
  const functions = {

    // unlike in Node, the functions $tag() and $str() both return the same,
    // because this object is a representation of the writer-field and 
    // $value holds only a collection of html-nodes.
    // Other functions like $attr() don't make sense here.
    $tag(options) {
      return this.$str(options)
    },
    $str(options) {
      const res = []
      each(this.$value, (node) => {
        res.push(node.$tag(options))
      })
      return res.join('')
    },
  }
  
  const data = {
    $type: 'html',
    $value: createNodes(isArr(obj.value) ? obj.value : [ obj.value ]),
  }
  return toObj(base, functions, data)
}