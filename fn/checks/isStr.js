import { isNum } from '../index'

/**
 * Check, if value is a string and optionally check for length.
 * 
 * @param {mixed} val 
 * @param {integer} min minimum length, optional
 * @param {integer} max maximum length, optional
 * @param {boolean} boundariesIncluded min and max included in length
 * @returns {boolean}
 */
export default function isStr(val, min = null, max = null, boundariesIncluded = true) {
  if (typeof val !== 'string') {
    return false
  }
  const i = isNum(min) ? min : val.length - 1
  const h = isNum(max) ? max : val.length + 1
  if (boundariesIncluded) {
    return (val.length >= i && val.length <= h)
  }
  return (val.length > i && val.length < h)
}