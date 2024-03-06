import { isTrue, isFalse } from '../index'

/**
 * Check, if a value is boolean.
 * 
 * Values also accepted if strict === false:
 * 0, '0', 'false', 'FALSE', 1, '1', 'true', 'TRUE'
 * 
 * @param {mixed} val 
 * @param {boolean} strict strict type check
 * @returns {boolean}
 */
export default function isBool(val, strict = true) {
  return isTrue(val, strict) || isFalse(val, strict)
}