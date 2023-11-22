import isArr from './isArr'
import clone from './clone'

/**
 * val can be single value or array with single values
 */
export default function inArr(val, arr) {
  if (!isArr(arr)) {
    return false
  }
  if (isArr(val)) {
    return clone(val).filter(n => !arr.includes(n)).length === 0
  }
  return arr.includes(val)
}