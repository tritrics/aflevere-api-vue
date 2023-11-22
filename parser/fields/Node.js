import { has, each, isArr, inArr, isStr, toBool, toObj, attrToStr } from '../../fnlib'
import base from './Base'
import { getOption } from '../index'

const selfClosing = ['area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input', 'link', 'meta', 'param', 'source', 'track', 'wbr']

export function createNode(obj) {
  const functions = {
    _isSelfClosing() {
      return has(this, '_element') && inArr(this._element, selfClosing)
    },
    _isNode() {
      return has(this, '_element')
    },
    _isText() {
      return !has(this, '_element')
    },
    _isLink() {
      return this._isNode() && this._element === 'a'
    },
    _hasChildren() {
      return isArr(this._value)
    },

    // the html-element
    _elem() {
      return has(this, '_element') ? this._element : null
    },

    // attributes as string or object
    _attr(asString, options) {
      const add = getOption('html.attr', options)
      const attr = { ...(this._attributes || {}), ...(add[this._element] || {}) }
      return toBool(asString) ? attrToStr(attr) : attr
    },

    // string including this elem = complete html-tag
    _tag(options) {
      if (this._isText()) {
        return `${this._value}`
      }
      let attr = this._attr(true, options)
      if (isStr(attr)) {
        attr = ` ${attr}`
      }
      if (this._isSelfClosing()) {
        return `<${this._element}${attr} />`
      }
      return `<${this._element}${attr}>${this._str(options)}</${this._element}>`
    },

    // string of children (_value)
    _str(options) {
      if (!this._hasChildren()) {
        return `${this._value}`
      }
      let children = []
      each(this._value, (child) => {
        children.push(child._tag(options))
      })
      return children.join('')
    }
  }

  //const type = has(obj, 'elem') ? obj.elem : 'text'
  const data = {
    _type: 'node'
  }
  if (has(obj, 'elem')) {
    data._element = `${obj.elem}`.toLowerCase().trim()
  }
  if (has(obj, 'attr')) {
    data._attributes = obj.attr
  }
  data._value = obj.value
  return toObj(base, functions, data)
}