import { toStr } from '../index'

/**
 * Converts string to loser case.
 * 
 * @param {string} val 
 * @returns {string}
 */
export default function lower(val) {
  return toStr(val).toLowerCase()
}