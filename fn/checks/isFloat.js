import { isNum } from '../index'

/**
 * Check, if value is a float number and optionally check interval.
 * 
 * @param {mixed} val 
 * @param {number} min minimum value, optional
 * @param {number} max maximum value, optional
 * @returns {boolean}
 */
export default function isFloat(val, min = null, max = null) {
  return isNum(val, min, max) && Math.floor(val) !== val
}