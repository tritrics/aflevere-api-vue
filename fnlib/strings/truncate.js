import {toStr} from '../index'
import {isInt} from '../index'

export default function truncate(val, length, replace = '...') {
  let res = toStr(val)
  if (isInt(length, 1) && res.length > length) {
    const add = toStr(replace)
    res = `${res.slice(0, (length - add.length))}${add}`
  }
  return res
}