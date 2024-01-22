import { isStr, regEsc } from '../index'

export default function ltrim(val, chars = ' ') {
  if (isStr(val)) {
    return val.replace(new RegExp(`^${regEsc(chars)}+`), '')
  }
  return ''
}