import { isStr } from '../index'

/**
 * Converts value to integer.
 * 
 * @param {mixed} val 
 * @returns {integer}
 */
export default function toInt(val) {
  if (isStr(val)) {
    val = val.replace(',', '.')
  }
  return parseInt(val, 10)
}