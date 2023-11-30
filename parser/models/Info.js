import { has, toBool, isStr, toObj } from '../../fnlib'
import base from './Base'
import { createLink } from './Link'

export function createInfo(obj) {
  const functions = {
    _val() {
      return this._v_meta.slug
    },
    _has(prop) {
      return isStr(prop) && has(this, prop)
    },
    _multilang() {
      return this._meta.multilang
    },
    _languages() {
      return has(this._meta, 'languages') ? this._meta.languages : 0
    },
  }

  let data = {
    _type: 'info',
    _meta: obj.meta,
  }
  data._meta.multilang = toBool(data._meta.multilang)
  if (has(obj, 'interface')) {
    data._interface = obj.interface
  }
  if (has(obj, 'value')) {
    data = { ...data, ...obj.value }
  }
  return toObj(base, functions, data)
}