import { isArr, isObj } from '../index'

/**
 * Loops an object or array and calls the callback function on each entry.
 * Callback parameters: (value, key, obj)
 * 
 * @param {object|array} obj 
 * @param {function} iteratee callback function
 */
export default function each(obj, iteratee) {
  if (isArr(obj)) {
    obj.forEach((value, key) => iteratee(value, key, obj))
  } else if (isObj(obj)) {
    Object.keys(obj || {}).forEach((key) => iteratee(obj[key], key, obj))
  }
}