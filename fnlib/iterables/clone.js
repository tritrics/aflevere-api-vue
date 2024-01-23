import { isArr, isObj } from '../index'

/**
 * Clone an object or an array.
 * 
 * @param {object|array} val 
 * @returns {object}
 */
export default function clone(val) {
  if (isArr(val)) {
    return val.slice(0)
  } else if (isObj(val)) {
    return structuredClone(val)
  }
  return val
}