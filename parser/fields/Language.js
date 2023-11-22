import { has, toBool, toObj } from '../../fnlib'
import base from './Base'
import { createLink } from './Link'

export function createLanguage(obj) {
  const functions = {
    _isDefault() {
      return this._meta.default
    },
    _code() {
      return this._meta.code
    },
    _locale() {
      return this._meta.locale
    },
    _direction() {
      return this._meta.direction
    },
    _tag(options) {
      return this._link._tag(options)
    },
    _attr(asString, options) { // { router: false , attr: { class: 'link-class' } }
      return this._link._attr(asString, options)
    },
  }

  obj.meta.default = toBool(obj.meta.default)
  
  let data = {
    _type: 'language',
    _meta: obj.meta,
    _link: createLink(obj),
  }
  if (has(obj, 'terms')) {
    data._terms = obj.terms
  }
  data._value = obj.value
  return toObj(base, functions, data)
}