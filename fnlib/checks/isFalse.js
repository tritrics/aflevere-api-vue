import { isBool } from '../index'

/**
 * Check, if a value is false.
 * 
 * Values also accepted if strict === false:
 * 0, '0', 'false', 'FALSE'
 * 
 * @param {mixed} val 
 * @param {boolean} strict strict type check
 * @returns {boolean}
 */
export default function isFalse(val, strict = true) {
  return isBool(val, strict, false, true)
}