import { isNum } from '../index'

/**
 * Check, if a value is an array and optionally check the length.
 * 
 * @param {mixed} val 
 * @param {integer} min minimum array length, optional
 * @param {integer} max maximum array length, optional
 * @param {boolean} boundariesIncluded min and max included in length
 * @returns {boolean}
 */
export default function isArr(val, min = null, max = null, boundariesIncluded = true) {
  if (!val || !Array.isArray(val)) {
    return false
  }
  const i = isNum(min) ? min : val.length - 1
  const h = isNum(max) ? max : val.length + 1
  if (boundariesIncluded) {
    return (val.length >= i && val.length <= h)
  }
  return (val.length > i && val.length < h)
}