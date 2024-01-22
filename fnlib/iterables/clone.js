import { isArr, isObj } from '../index'

export default function clone(obj) {
  if (isArr(obj)) {
    return obj.slice(0)
  } else if (isObj(obj)) {
    return structuredClone(obj)
  }
  return obj
}