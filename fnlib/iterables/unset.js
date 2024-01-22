import { isArr, isObj, has } from '../index'

export default function unset(obj, key) {
  if (!has(obj, key)) {
    return
  }
  if (isArr(obj)) {
    obj.splice(key, 1)
  } else if (isObj(obj)) {
    delete obj[key]
  }
}