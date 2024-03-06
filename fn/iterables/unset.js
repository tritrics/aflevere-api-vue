import { isArr, isObj, has } from '../index'

/**
 * Unset/delete a node in an object or array.
 * 
 * @param {object|array} obj 
 * @param {string|number} key 
 * @returns void
 */
export default function unset(obj, key) {
  if (has(obj, key)) {
    if (isArr(obj)) {
      obj.splice(key, 1)
    } else if (isObj(obj)) {
      delete obj[key]
    }
  }
}