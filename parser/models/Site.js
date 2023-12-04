import { has, isStr, toObj } from '../../fnlib'
import base from './Base'

export function createSite(obj) {
  const functions = {
    $val() {
      return this.$meta.host
    },
    $has(prop) {
      return isStr(prop) && has(this, prop)
    },
  }
  
  let data = {
    $type: 'site',
    $meta: obj.meta,
  }
  if (has(obj, 'value')) {
    data = { ...data, ...obj.value }
  }
  return toObj(base, functions, data)
}