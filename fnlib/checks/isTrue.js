import { isStr, isNum, inArr, toStr } from '../index'

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
  if (val === true) {
    return true
  }
  if (!strict && (isStr(val) || isNum(val))) {
    return inArr(toStr(val).toLowerCase(), [ '1', 'true' ])
  }
  return false
}