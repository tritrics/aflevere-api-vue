import isStr from './isStr'
import regEsc from './regEsc'

export default function ltrim(val, chars = ' ') {
  if (isStr(val)) {
    return val.replace(new RegExp(`^${regEsc(chars)}+`), '')
  }
  return ''
}