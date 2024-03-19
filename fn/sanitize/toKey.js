import { trim, lower, toStr } from '../index'

/**
 * Converts value to normalized string for use as keys or standardized values.
 * 
 * @param {mixed} val 
 * @returns {string,null}
 */
export default function toKey(val) {
  return trim(lower(toStr(val)))
}