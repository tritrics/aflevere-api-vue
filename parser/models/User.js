import { has, toObj } from '../../fnlib'
import base from './Base'

export function createUser(obj) {
  const functions = {
    $val() {
      return this.$meta.id
    },
  }
  
  let data = {
    $type: 'user',
    $meta: obj.meta,
  }
  if (has(obj, 'value')) {
    data = { ...data, ...obj.value }
  }
  return toObj(base, functions, data)
}