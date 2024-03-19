import { has, extend } from '../../fn'
import { createBase, createString } from './index'

/**
 * Model for API field: option
 *
 * @param {object} obj the field data
 * @returns {object}
 */
export default function createOption(obj) {
  const functions = {}
  
  const data = {
    $type: 'option',
    $value: obj.value,
  }
  if (has(obj, 'label')) {
    data.label = createString(obj.label)
  }
  return extend(createBase(), functions, data)
}
