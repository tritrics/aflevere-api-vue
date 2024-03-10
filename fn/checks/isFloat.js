import { isNum } from '../index'

/**
 * Check, if value is a float number and optionally check interval.
 * 
 * @param {mixed} val 
 * @param {number} min minimum value, optional
 * @param {number} max maximum value, optional
 * @param {boolean} strict allow/disallow string with numbers
 * @returns {boolean}
 */
export default function isFloat(val, min = null, max = null, strict = true) {
  if (!strict && isStr(val) && /^-?\d+\.?\d*$/.test(val)) {
    val = toNum(val)
  }
  return isNum(val, min, max, true) && Math.floor(val) !== val
}