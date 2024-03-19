import { toBool, extend } from '../../fn'
import { createBase } from './index'

/**
 * Model for API field: boolean
 * 
 * @param {object} obj the field data
 * @returns {object}
 */
export default function createBoolean(obj) {
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
  return extend(createBase(), functions, data)
}
