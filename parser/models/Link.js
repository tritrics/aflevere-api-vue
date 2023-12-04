import { attrToStr, extendObj, toBool } from '../../fnlib'
import { getOption } from '../index'
import { createNode } from './Node'

// creates Link from fields (url, email...) or link-nodes in writer
export function createLink(obj) {
  const node = {
    elem: 'a',
    attr: obj.link || obj.attr,
  }
  if (obj.type === 'page') {
    node.value = obj.meta.title
  } else if (obj.type === 'file' || obj.type === 'image') {
    node.value = obj.meta.title
  } else {
    node.value = obj.value
  }
  const field = createNode(node)
  
  const extend = {
    $attr(asString, options) {
      const router = toBool(getOption('link.router', options))
      const elemAttr = { ...(this.$attributes || {}) }
      if (elemAttr.type === 'intern' && router) {
        elemAttr.to = elemAttr.href
        elemAttr['router-link'] = null
        delete(elemAttr.href)
      }
      elemAttr[`data-link-${elemAttr.type}`] = null
      delete(elemAttr.type)
      const add = getOption('html.attr', options)
      const attr = { ...elemAttr, ...(add[this.$element] || {}) }
      return toBool(asString) ? attrToStr(attr) : attr
    }
  }
  return extendObj(field, extend)
}

export function getLinkAttr(link, options) {

}