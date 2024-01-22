import { inArr, isStr, isNum, toStr } from '../index'

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