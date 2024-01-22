import { isArr, isObj } from '../index'

export default function each(obj, iteratee) {
  if (isArr(obj)) {
    obj.forEach((value, key) => iteratee(value, key, obj))
  } else if (isObj(obj)) {
    Object.keys(obj || {}).forEach((key) => iteratee(obj[key], key, obj))
  }
}