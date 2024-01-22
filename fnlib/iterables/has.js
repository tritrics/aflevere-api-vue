import { isArr, isObj } from '../index'

export default function has(obj, key) {
  if (isArr(obj)) {
    return obj[key] !== undefined
  } else if (isObj(obj)) {
    return Object.prototype.hasOwnProperty.call(obj, key)
  }
  return false
}