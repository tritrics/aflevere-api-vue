import { isNum, isStr, toNum } from '../index'

/**
 * Check, if value is an integer number and optionally check interval.
 * 
 * @param {mixed} val 
 * @param {number} min minimum value, optional
 * @param {number} max maximum value, optional
 * @param {boolean} strics allow/disallow string with numbers
 * @returns {boolean}
 */
export default function isInt(val, min = null, max = null, strict = true) {
  if (!strict && isStr(val) && /^-?\d+$/.test(val)) {
    val = toNum(val)
  }
  return isNum(val, min, max, true) && Math.floor(val) === val
}