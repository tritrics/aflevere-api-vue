import { isObj, isArr } from '../index'

/**
 * Check, if value is iterable (object, array).
 * 
 * @param {mixed} val 
 * @returns {boolean}
 */
export default function isIterable(val) {
  return isObj(val) || isArr(val)
}