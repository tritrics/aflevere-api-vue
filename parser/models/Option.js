import { has, extend } from '../../fn'
import { createBase } from './Base'
import { createString } from './String'

/**
 * Model for API field: option
 *
 * @param {object} obj the field data
 * @returns {object}
 */
export function createOption(obj) {
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
