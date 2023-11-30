import { toNum, isInt, toObj } from '../../fnlib'
import { getOption } from '../index'
import base from './Base'

export function createNumber(obj) {
  const functions = {
    _isMin(min) {
      return isNum(this._value, min, null, true)
    },
    _isMax(max) {
      return isNum(this._value, null, max, true)
    },
    _isGreater(min) {
      return isNum(this._value, min, null, false)
    },
    _isSmaller(max) {
      return isNum(this._value, null, max, false)
    },
    _isBetween(min, max, boundariesIncluded = true) {
      return isNum(this._value, min, max, boundariesIncluded)
    },
    toString(options) {
      const fixed = getOption('number.fixed', options)
      const stringOptions = {}
      if (isInt(fixed)) {
        stringOptions.minimumFractionDigits = fixed
        stringOptions.maximumFractionDigits = fixed
      }
      return this._value.toLocaleString(
        getOption('global.locale', options),
        stringOptions
      )
    },
  }
  
  const data = {
    _type: 'number',
    _value: toNum(obj.value),
  }
  return toObj(base, functions, data)
}
