/**
 * optionally check period
 */

export default function isDate(val, min = null, max = null, boundariesIncluded = true) {
  if (val instanceof Date) {
      const i = isDate(min) ? min : val
      const h = isDate(max) ? max : val
      if (boundariesIncluded) {
        return val >= i && val <= h
      } else {
        return val > i && val < h
      }
    }
    return false
}