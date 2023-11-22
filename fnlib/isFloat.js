import isNum from './isNum'

export default function isFloat(val, min = null, max = null, boundariesIncluded = true) {
  return isNum(val, min, max, boundariesIncluded) && Math.floor(val) !== val
}