import { isArr, isObj } from '../index'

/**
 * Check, if an object or array has a given key.
 * 
 * @param {object|array} obj
 * @param {mixed} key 
 * @returns {boolean}
 */
export default function has(obj, key) {
  if (isArr(obj)) {
    return obj[key] !== undefined
  } else if (isObj(obj)) {
    return Object.prototype.hasOwnProperty.call(obj, key)
  }
  return false
}