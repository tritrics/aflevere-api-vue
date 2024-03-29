import { has, extend } from '../../fn'
import { createBase } from './index'

/**
 * Model for API field: user
 * 
 * @param {object} obj the field data
 * @returns {object}
 */
export default function createUser(obj) {
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
  return extend(createBase(), functions, data)
}