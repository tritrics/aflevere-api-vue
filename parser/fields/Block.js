import { has, toObj } from '../../fnlib'
import base from './Base'

export function createBlock(obj) {
  const functions = {
    _val() {
      return this._v_meta.id
    },
  }

  let data = {
    _type: 'block',
    _block: obj.block,
  }
  if (has(obj, 'value')) {
    data = { ...data, ...obj.value }
  }
  return toObj(base, functions, data)
}