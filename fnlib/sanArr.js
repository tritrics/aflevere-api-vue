import isArr from './isArr'

export default function sanArr(val, removeEmpty = true) {
  if (!isArr(val)) {
    return null
  }
  if (removeEmpty) {
    val = val.filter(n => n)
  }
  // ... more to come
  return val
}