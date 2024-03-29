import { isNum } from '../index'

/**
 * Check, if value is a string and optionally check for length.
 * 
 * @param {mixed} val 
 * @param {integer} min minimum length, optional
 * @param {integer} max maximum length, optional
 * @param {boolean} allowLinebreaks optionally check for line-breaks
 * @returns {boolean}
 */
export default function isStr(val, min = null, max = null, allowLinebreaks = true) {
  if (typeof val !== 'string') {
    return false
  }
  if (!allowLinebreaks && /\r|\n/.exec(val)) {
    return false
  }
  const i = isNum(min) ? min : val.length - 1
  const h = isNum(max) ? max : val.length + 1
  return (val.length >= i && val.length <= h)
}