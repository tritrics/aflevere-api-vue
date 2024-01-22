import { inArr, isStr, isNum, toStr } from '../index'

/**
 * Check, if a value is boolean.
 * 
 * Values also accepted if strict === false:
 * 0, '0', 'false', 'FALSE', 1, '1', 'true', 'TRUE'
 * 
 * Use isTrue() or isFalse() to check also for bool-type.
 * 
 * @param {mixed} val 
 * @param {boolean} strict strict type check
 * @param {boolean} acceptTrue accept true as valid
 * @param {boolean} acceptFalse accept false as valid
 * @returns {boolean}
 */
export default function isBool(val, strict = true, acceptTrue = true, acceptFalse = true) {
  if (typeof val === 'boolean') {
    return (val === true && acceptTrue) || (val === false && acceptFalse)
  }
  if (!strict && (isStr(val) || isNum(val))) {
    const valid = []
    if (acceptTrue) {
      valid.push('1')
      valid.push('true')
    }
    if (acceptFalse) {
      valid.push('0')
      valid.push('false')
    }
    return inArr(toStr(val).toLowerCase(), valid)
  }
  return false
}