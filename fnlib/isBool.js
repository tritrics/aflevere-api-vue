import inArr from "./inArr"
import isStr from "./isStr"
import isNum from "./isNum"
import toStr from "./toStr"

export default function isBool(val, strict = true) {
  if (typeof val === 'boolean') {
    return true
  }
  if (!strict && (isStr(val) || isNum(val))) {
    return inArr(toStr(val).toLowerCase(), ['0', '1', 'true', 'false'])
  }
  return false
}