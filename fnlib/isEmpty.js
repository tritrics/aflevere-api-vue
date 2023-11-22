import isNull from './isNull'
import isUndef from './isUndef'

export default function isEmpty(val) {
  return val === '' || isNull(val) || isUndef(val)
}