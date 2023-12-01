import isStr from './isStr'

export default function ltrim(val, chars = ' ') {
  if (isStr(val, 1)) {
    while (chars.includes(val.charAt(0))) {
      val = val.substring(1)
    }
  }
  return val
}