/**
 * Converts value to string.
 * 
 * @param {mixed} val 
 * @returns {string}
 */
export default function toStr(val, stripLinebreaks = false) {
  return typeof val === 'object' ? '' : `${val}`
}