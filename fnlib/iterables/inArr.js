import { isArr, clone } from '../index'

/**
 * Check if one or more values exist in array.
 * 
 * @param {mixed} val can be single value or array with single values
 * @param {array} arr 
 * @returns {boolean}
 */
export default function inArr(val, arr) {
  if (!isArr(arr)) {
    return false
  }
  if (isArr(val)) {
    return clone(val).filter(n => !arr.includes(n)).length === 0
  }
  return arr.includes(val)
}