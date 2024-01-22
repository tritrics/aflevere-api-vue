import {isStr} from '../index'
import {regEsc} from '../index'

export default function rtrim(val, chars = ' ') {
  if (isStr(val)) {
    return val.replace(new RegExp(`${regEsc(chars)}+$`), '')
  }
  return ''
}