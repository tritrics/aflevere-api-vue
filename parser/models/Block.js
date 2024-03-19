import { has, extend } from '../../fn'
import { createBase } from './index'

/**
 * Model for API field: block
 * 
 * @param {object} obj the field data
 * @returns {object}
 */
export default function createBlock(obj) {
  const functions = {
    $val() {
      return this.$meta.id
    },
  }

  let data = {
    $type: 'block',
    $block: obj.block,
  }
  if (has(obj, 'value')) {
    data = { ...data, ...obj.value }
  }
  return extend(createBase(), functions, data)
}