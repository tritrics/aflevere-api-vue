import inArr from "./inArr"
import isStr from "./isStr"
import isNum from "./isNum"
import toStr from "./toStr"

/**
 * true, 'true', 'TRUE', 1, '1' converts to true, the rest to false
 */
export default function toBool(val) {
  if (typeof val === 'boolean') {
    return val
  }
  if (isStr(val) || isNum(val)) {
    return inArr(toStr(val).toLowerCase(), ['true', '1'])
  }
  return false
}