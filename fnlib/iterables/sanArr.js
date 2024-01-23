import { isArr, unique, clone } from '../index'

/**
 * Sanitize an array.
 * 
 * Options: 
 * {
 *   empty: true, remove empty values
 *   unique: false, make array unique
 * }
 * 
 * @param {array} val 
 * @param {object} options 
 * @returns 
 */
export default function sanArr(val, options = { empty: true, unique: false }) {
  if (!isArr(val)) {
    return val
  }
  let res = clone(val)
  if (isTrue(options.empty)) {
    res = res.filter(n => n)
  }
  if(isTrue(options.unique)) {
    res = unique(res)
  }
  return res
}