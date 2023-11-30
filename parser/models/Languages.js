import { has, each, isStr, toObj } from '../../fnlib'
import base from './Base'

export function createLanguages(obj) {
  const functions = {
    _val() {
      return this._v_meta.slug
    },
    _has(code) {
      return isStr(code) && has(this._value, code)
    },
    _get(code) {
      return this._value[code] || false
    },
    _codes(defaultFirst = true) {
      const first = []
      const codes = []
      each(this._value, (lang, code) => {
        if (defaultFirst && lang._isDefault()) {
          first.push(code)
        } else {
          codes.push(code)
        }
      })
      return first.concat(codes.sort())
    },
    _default() {
      let res = false
      each(this._value, lang => {
        if (lang._default()) {
          res = lang
        }
      })
      return res
    }
  }
  
  let data = {
    _type: 'languages',
    _meta: obj.meta,
    _value: obj.value,
  }
  return toObj(base, functions, data)
}