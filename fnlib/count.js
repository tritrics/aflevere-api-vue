import isObj from './isObj'
import isArr from './isArr'
import isStr from './isStr'
import isNum from './isNum'
import toStr from './toStr'

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