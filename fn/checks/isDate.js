/**
 * Check, if value is a Date instance and optionally check period.
 * 
 * @param {mixed} val 
 * @param {Date} min the minimum date, optional
 * @param {Date} max the maximum date, optional
 * @returns {boolean}
 */
export default function isDate(val, min = null, max = null) {
  if (val instanceof Date) {
      const i = isDate(min) ? min : val
      const h = isDate(max) ? max : val
      return val >= i && val <= h
    }
    return false
}