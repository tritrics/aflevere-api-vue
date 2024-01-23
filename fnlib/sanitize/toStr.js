/**
 * Converts value to string.
 * 
 * @param {mixed} val 
 * @returns {string}
 */
export default function toStr(val) {
  return typeof val === 'object' ? '' : `${val}`
}