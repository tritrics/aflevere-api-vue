import { isStr } from '../index'

/**
 * Check, if value is null.
 * 
 * Values also accepted if strict === false:
 * 'null', 'NULL'
 * 
 * @param {mixed} val 
 * @returns {boolean}
 */
export default function isNull(val, strict = true) {
  if(val === null) {
    return true
  }
  if (!strict && isStr(val)) {
    return val.toLowerCase() === 'null'
  }
  return false
}