import { inArr, isStr, isNum, toStr } from '../index'

/**
 * Converts value to boolean.
 * true, 'true', 'TRUE', 1, '1' converts to true, the rest to false
 * 
 * @param {mixed} val 
 * @returns {boolean}
 */
export default function toBool(val) {
  if (typeof val === 'boolean') {
    return val
  }
  if (isStr(val) || isNum(val)) {
    return inArr(toStr(val).toLowerCase(), ['true', '1'])
  }
  return false
}