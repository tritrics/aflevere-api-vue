/**
 * Check, if value is a number and optionally check interval.
 * 
 * @param {mixed} val 
 * @param {number} min minimum value, optional
 * @param {number} max maximum value, optional
 * @param {boolean} boundariesIncluded min and max included in interval
 * @returns {boolean}
 */
export default function isNum(val, min = null, max = null, boundariesIncluded = true) {
  if (typeof val !== 'number' || !Number.isFinite(val)) {
    return false
  }
  const i = isNum(min) ? min : val - 1
  const h = isNum(max) ? max : val + 1
  if (boundariesIncluded) {
    return (val >= i && val <= h)
  }
  return (val > i && val < h)
}