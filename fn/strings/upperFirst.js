import { toStr } from '../index'

/**
 * Converts first character of a string to uppercase and the rest to lower.
 * 
 * @param {string} val 
 * @returns {string}
 */
export default function upperFirst(val) {
  const str = toStr(val)
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase()
}