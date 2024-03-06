import { isNull, isUndef } from '../index'

/**
 * Check, if a value is empty string, null or undefined.
 * 
 * @param {mixed} val 
 * @returns {boolean}
 */
export default function isEmpty(val) {
  return val === '' || isNull(val) || isUndef(val)
}