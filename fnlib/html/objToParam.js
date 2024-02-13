import { each, count, isStr, isNum, isArr } from '../index'

/**
 * Converts an object to GET params.
 */
export default function objToParams(obj) {
  const res = []
  each (obj, (val, key) => {
     if (isStr(val) || isNum(val)) {
      res.push(`${key}=${encodeURIComponent(val)}`)
    } else if (isArr(val)) {
      each (val, (entry) => {
        res.push(`${key}[]=${encodeURIComponent(entry)}`)
      })
    }
  })
  return count(res) ? `?${res.join('&')}` : ''
}