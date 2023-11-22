import { has, toObj } from '../../fnlib'
import base from './Base'

export function createUser(obj) {
  const functions = {
    _val() {
      return this._v_meta.id
    },
  }
  
  let data = {
    _type: 'user',
    _meta: obj.meta,
  }
  if (has(obj, 'value')) {
    data = { ...data, ...obj.value }
  }
  return toObj(base, functions, data)
}