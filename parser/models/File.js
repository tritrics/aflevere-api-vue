import { has, isStr, toObj } from '../../fnlib'
import base from './Base'
import { createLink } from './Link'

export function createFile(obj) {
  const functions = {
    _val() {
      return this._v_meta.filename
    },
    _has(prop) {
      return isStr(prop) && has(this, prop)
    },
    _tag(options) {
      return this._link._tag(options)
    },
    _attr(asString, options) { // { router: false , attr: { class: 'link-class' } }
      return this._link._attr(asString, options)
    },
  }
  
  let data = {
    _type: 'file',
    _meta: obj.meta,
    _link: createLink(obj),
  }
  if (has(obj, 'value')) {
    data = { ...data, ...obj.value }
  }
  return toObj(base, functions, data)
}
