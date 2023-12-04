import { toNum, isInt, toObj } from '../../fnlib'
import { getOption } from '../index'
import base from './Base'

export function createNumber(obj) {
  const functions = {
    $isMin(min) {
      return isNum(this.$value, min, null, true)
    },
    $isMax(max) {
      return isNum(this.$value, null, max, true)
    },
    $isGreater(min) {
      return isNum(this.$value, min, null, false)
    },
    $isSmaller(max) {
      return isNum(this.$value, null, max, false)
    },
    $isBetween(min, max, boundariesIncluded = true) {
      return isNum(this.$value, min, max, boundariesIncluded)
    },
    toString(options) {
      const fixed = getOption('number.fixed', options)
      const stringOptions = {}
      if (isInt(fixed)) {
        stringOptions.minimumFractionDigits = fixed
        stringOptions.maximumFractionDigits = fixed
      }
      return this.$value.toLocaleString(
        getOption('global.locale', options),
        stringOptions
      )
    },
  }
  
  const data = {
    $type: 'number',
    $value: toNum(obj.value),
  }
  return toObj(base, functions, data)
}
