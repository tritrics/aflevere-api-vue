import { isStr } from '../index'

/**
 * Converts value to number.
 * 
 * @param {mixed} val 
 * @returns {float}
 */
export default function toNum(val) {
  if (isStr(val)) {
    val = val.replace(',', '.')
  }
  const res = parseFloat(val)
  return res ? res : null
}