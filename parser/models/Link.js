import { attrToStr, toObj, toBool, isStr } from '../../fnlib'
import base from './Base'
import { getOption } from '../index'

/**
 * Helper function to get link attributes.
 * Exported for use in other models.
 * 
 * @param {string} element the type of the html element (i.e. a)
 * @param {object} attributes attributes of the html element
 * @param {bool} asString return as string (otherwhise as object)
 * @param {object} options the user-given options
 * @returns {string|object}
 */
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

/**
 * Model for API field: link, tel, email, url
 * 
 * @param {object} obj the field data
 * @returns {object}
 */
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