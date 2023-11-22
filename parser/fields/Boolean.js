import { toBool, toObj } from '../../fnlib'
import base from './Base'

export function createBoolean(obj) {
  const functions = {
    _is(prop) {
      return this._value === toBool(prop)
    },

    _isTrue() {
      return this._value === true
    },
    
    _isFalse() {
      return this._value === false
    },
  }
  
  const data = {
    _type: 'boolean',
    _value: toBool(obj.value),
  }
  return toObj(base, functions, data)
}
