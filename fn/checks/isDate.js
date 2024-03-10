import { toDate, isStr } from '../index'

/**
 * Check, if value is a Date instance and optionally check period.
 * 
 * @param {mixed} val 
 * @param {Date} min the minimum date, optional
 * @param {Date} max the maximum date, optional
 * @param {boolean} strict allow/disallow string date, specified by format
 * @param {string} format must contain yyyy, mm and dd
 * @returns {boolean}
 */
export default function isDate(val, min = null, max = null, strict = true, format = 'yyyy-mm-dd') {
  if (!strict && isStr(val)) {
    val = toDate(val, format)
  }
  if (val instanceof Date) {
      const i = isDate(min) ? min : val
      const h = isDate(max) ? max : val
      return val >= i && val <= h
    }
    return false
}