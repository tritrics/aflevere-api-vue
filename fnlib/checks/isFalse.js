import { isStr, isNum, inArr, toStr } from '../index'

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
  if (val === false) {
    return true
  }
  if (!strict && (isStr(val) || isNum(val))) {
    return inArr(toStr(val).toLowerCase(), [ '0', 'false' ])
  }
  return false
}