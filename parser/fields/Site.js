import { has, isStr, toObj } from '../../fnlib'
import base from './Base'

export function createSite(obj) {
  const functions = {
    _val() {
      return this._v_meta.host
    },
    _has(prop) {
      return isStr(prop) && has(this, prop)
    },
  }
  
  let data = {
    _type: 'site',
    _meta: obj.meta,
  }
  if (has(obj, 'value')) {
    data = { ...data, ...obj.value }
  }
  return toObj(base, functions, data)
}