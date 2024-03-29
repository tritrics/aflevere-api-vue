import { has, each, isArr, inArr, isStr, toBool, extend, objToAttr } from '../../fn'
import { getOption } from '../index'
import { createBase } from './index'
import { getLinkAttributes } from './Link'

/**
 * Array with self-closing html nodes
 */
const selfClosing = ['area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input', 'link', 'meta', 'param', 'source', 'track', 'wbr']

/**
 * Subnode of model for field: html
 * 
 * @param {object} obj 
 * @returns {object}
 */
export default function createHtmlNode(obj) {
  const functions = {
    $isSelfClosing() {
      return has(this, '$element') && inArr(this.$element, selfClosing)
    },
    $isNode() {
      return has(this, '$element')
    },
    $isText() {
      return !has(this, '$element')
    },
    $isLink() {
      return this.$isNode() && this.$element === 'a'
    },
    $hasChildren() {
      return isArr(this.$value)
    },

    // the html-element
    $elem() {
      return has(this, '$element') ? this.$element : null
    },

    // attributes as string or object
    $attr(asString, options) {
      if (this.$isLink()) {
        return getLinkAttributes(this.$element, this.$attributes, asString, options)
      } else {
        const add = getOption('html.attr', options)
        const res = { ...(this.$attributes || {}), ...(add[this.$element] || {}) }
        return toBool(asString) ? objToAttr(res) : res
      }
    },

    // string including this elem = complete html-tag
    $tag(options) {
      if (this.$isText()) {
        return `${this.$value}`
      }
      let attr = this.$attr(true, options)
      if (isStr(attr)) {
        attr = ` ${attr}`
      }
      if (this.$isSelfClosing()) {
        return `<${this.$element}${attr} />`
      }
      return `<${this.$element}${attr}>${this.$str(options)}</${this.$element}>`
    },

    // string of children ($value)
    $str(options) {
      if (!this.$hasChildren()) {
        return `${this.$value}`
      }
      let children = []
      each(this.$value, (child) => {
        children.push(child.$tag(options))
      })
      return children.join('')
    }
  }

  //const type = has(obj, 'elem') ? obj.elem : 'text'
  const data = {
    $type: 'html-node'
  }
  if (has(obj, 'elem')) {
    data.$element = `${obj.elem}`.toLowerCase().trim()
  }
  if (has(obj, 'attr')) {
    data.$attributes = obj.attr
  }
  data.$value = obj.value
  return extend(createBase(), functions, data)
}