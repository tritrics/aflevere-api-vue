/**
 * Converts value to number.
 * Strict, doesn't convert fx "a12"
 * 
 * @param {mixed} val 
 * @returns {float}
 */
export default function toNum(val) {
  const res = parseFloat(val)
  return res ? res : null
}