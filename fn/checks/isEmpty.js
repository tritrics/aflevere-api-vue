import { isNull, isUndef, isArr } from '../index'

/**
 * Check, if a value is an empty array, empty string, null or undefined.
 * 
 * @param {mixed} val 
 * @returns {boolean}
 */
export default function isEmpty(val) {
  if (isArr(val)) {
    return val.length === 0
  }
  return val === '' || isNull(val) || isUndef(val)
}