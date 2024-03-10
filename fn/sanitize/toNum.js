/**
 * Converts value to number.
 * 
 * @param {mixed} val 
 * @returns {float}
 */
export default function toNum(val) {
  const res = parseFloat(val)
  return res ? res : null
}