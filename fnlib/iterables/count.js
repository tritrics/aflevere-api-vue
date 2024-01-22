import { isObj, isArr, isStr, isNum, toStr } from '../index'

export default function count(val) {
  if (isArr(val) || isStr(val)) {
    return val.length
  } else if (isObj(val)) {
    return Object.keys(val).length
  } else if (isNum(val)) {
    return toStr(val).length
  }
  return 0
}