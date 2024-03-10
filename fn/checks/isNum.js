import { isStr, toNum } from '../index'

/**
 * Check, if value is a number and optionally check interval.
 * 
 * @param {mixed} val 
 * @param {number} min minimum value, optional
 * @param {number} max maximum value, optional
 * @param {boolean} strict allow/disallow string with numbers
 * @returns {boolean}
 */
export default function isNum(val, min = null, max = null, strict = true) {
  if (!strict && isStr(val) && /^-?\d+\.?\d*$/.test(val)) {
    val = toNum(val)
  }
  if (typeof val === 'number' && Number.isFinite(val)) {
    const i = isNum(min) ? min : val - 1
    const h = isNum(max) ? max : val + 1
    return (val >= i && val <= h)
  }
  return false
}