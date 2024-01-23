import { isObj, isArr } from '../index'
/**
 * Extend an object or an array by another.
 * Does nothing if both values are not of the same data type.
 * 
 * @param {object|array} base
 * @param {object|array} extend 
 * @returns 
 */
export default function extend(base, extend) {
  if (isObj(base) && isObj(extend)) {
    return Object.assign(base, extend)
  } else if (isArr(base) && isArr(extend)) {
    return base.concat(extend)
  }
  return base
}