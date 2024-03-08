import { isArr, clone } from '../index'

/**
 * Check if one or more values exist in array.
 * 
 * @param {mixed} mixed can be single value or array with single values
 * @param {array} arr 
 * @returns {boolean}
 */
export default function inArr(mixed, arr) {
  if (!isArr(arr)) {
    return false
  }
  if (isArr(mixed)) {
    return clone(mixed).filter(n => !arr.includes(n)).length === 0
  }
  return arr.includes(mixed)
}