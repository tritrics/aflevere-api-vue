import { attrToStr, toObj, toBool, isStr } from '../../fnlib'
import base from './Base'
import { getOption } from '../index'

// function reused by HtmlNode
export function getLinkAttributes(element, attributes, asString, options) {
  const router = toBool(getOption('link.router', options))
  const elemAttr = { ...(attributes || {}) }
  if (elemAttr.type === 'page' && router) {
    elemAttr.to = elemAttr.href
    elemAttr['router-link'] = null
    delete(elemAttr.href)
  }
  elemAttr[`data-link-${elemAttr.type}`] = null
  delete(elemAttr.type)
  const add = getOption('html.attr', options)
  const attr = { ...elemAttr, ...(add[element] || {}) }
  return toBool(asString) ? attrToStr(attr) : attr
}

export function createLink(obj) {
  const functions = {

    // analog to HtmlNode
    $elem() {
      return 'a'
    },
    $attr(asString, options) {
      return getLinkAttributes('a', this.$attributes, asString, options)
    },

    // analog to HtmlNode
    $tag(options) {
      let attr = this.$attr(true, options)
      if (isStr(attr)) {
        attr = ` ${attr}`
      }
      return `<a${attr}>${this.$str(options)}</a>`
    },
  }

  const data = {
     $type: 'link',
  }
  if (obj.type === 'site') {
    data.$attributes = obj.home
  } else {
    data.$attributes = obj.link
  }
  if (obj.type === 'page' || obj.type === 'file' || obj.type === 'image' || obj.type === 'site') {
    data.$value = obj.meta.title
  } else {
    data.$value = obj.value
  }

  return toObj(base, functions, data)
}