import isStr from './isStr'

export default function rtrim(val, chars = ' ') {
  if (isStr(val, 1)) {
    while (chars.includes(val.charAt(val.length - 1))) {
      val = val.substring(0, val.length - 1)
    }
  }
  return val
}