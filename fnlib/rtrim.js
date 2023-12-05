import isStr from './isStr'
import regEsc from './regEsc'

export default function rtrim(val, chars = ' ') {
  if (isStr(val)) {
    return val.replace(new RegExp(`${regEsc(chars)}+$`), '')
  }
  return ''
}