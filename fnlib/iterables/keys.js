import { isObj, isArr } from '../index'

export default function keys(obj) {
  if (isObj(obj)) {
    return Object.keys(obj || {})
  } else if (isArr(obj)) {
    return obj.keys()
  }
  return []
}