import isNum from './isNum'

export default function isArr(val, min, max, boundariesIncluded = true) {
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