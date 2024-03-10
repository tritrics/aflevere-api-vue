import { isStr } from '../index'

/**
 * Converts value to float.
 * 
 * @param {mixed} val 
 * @returns {float}
 */
export default function toFloat(val) {
  if (isStr(val)) {
    val = val.replace(',', '.')
  }
  return parseFloat(val)
}