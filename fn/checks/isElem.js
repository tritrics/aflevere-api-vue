/**
 * Check, if a value is a HTML element.
 * 
 * @param {mixed} val 
 * @returns {boolean}
 */
export default function isElem(val) {
  return val && val instanceof HTMLElement
}