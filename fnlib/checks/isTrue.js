import { isBool } from '../index'

/**
 * Check, if a value is true.
 * 
 * Values also accepted if strict === false:
 * 1, '1', 'true', 'TRUE'
 * 
 * @param {mixed} val 
 * @param {boolean} strict strict type check
 * @returns {boolean}
 */
export default function isTrue(val, strict = true) {
  return isBool(val, strict, true, false)
}