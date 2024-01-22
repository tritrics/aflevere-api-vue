import { toBool, toObj } from '../../fnlib'
import base from './Base'

/**
 * Model for API field: boolean
 * 
 * @param {object} obj the field data
 * @returns {object}
 */
export function createBoolean(obj) {
  const functions = {
    $is(prop) {
      return this.$value === toBool(prop)
    },

    $isTrue() {
      return this.$value === true
    },
    
    $isFalse() {
      return this.$value === false
    },
  }
  
  const data = {
    $type: 'boolean',
    $value: toBool(obj.value),
  }
  return toObj(base, functions, data)
}
