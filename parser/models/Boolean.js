import { toBool, toObj } from '../../fnlib'
import base from './Base'

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
