import { isObj, isArr } from '../index'

/**
 * Get the keys from an object or array.
 * 
 * @param {object|array} obj 
 * @returns {array}
 */
export default function keys(obj) {
  if (isObj(obj)) {
    return Object.keys(obj || {})
  } else if (isArr(obj)) {
    return obj.keys()
  }
  return []
}