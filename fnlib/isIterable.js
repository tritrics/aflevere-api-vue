import isObj from './isObj'
import isArr from './isArr'

export default function isIterable(val) {
  return isObj(val) || isArr(val)
}