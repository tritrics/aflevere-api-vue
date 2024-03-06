import { toStr } from '../index'

/**
 * Escapes critical characters in a string for use as a regular expression.
 * 
 * @param {string} str 
 * @returns {string}
 */
export default function regEsc(str) {
  return toStr(str).replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&')
}