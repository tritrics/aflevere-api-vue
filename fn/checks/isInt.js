import { isNum } from '../index'

/**
 * Check, if value is an integer number and optionally check interval.
 * 
 * @param {mixed} val 
 * @param {number} min minimum value, optional
 * @param {number} max maximum value, optional
 * @param {boolean} boundariesIncluded min and max included in interval
 * @returns {boolean}
 */
export default function isInt(val, min = null, max = null, boundariesIncluded = true) {
  return isNum(val, min, max, boundariesIncluded) && Math.floor(val) === val
}