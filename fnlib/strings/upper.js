import {toStr} from '../index'

/**
 * Converts string to upper case.
 * 
 * @param {string} val 
 * @returns {string}
 */
export default function upper(val) {
  return toStr(val).toUpperCase()
}