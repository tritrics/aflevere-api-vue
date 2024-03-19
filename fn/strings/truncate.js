import { toStr, isInt } from '../index'

/**
 * Cuts the string to the given length and adds ... to the end.
 * 
 * @param {string} val 
 * @param {integer} length 
 * @param {string} replace 
 * @returns {string}
 */
export default function truncate(val, length, replace = '...') {
  let res = toStr(val)
  if (isInt(length, 1) && res.length > length) {
    const add = toStr(replace)
    res = `${res.slice(0, (length - add.length))}${add}`
  }
  return res
}