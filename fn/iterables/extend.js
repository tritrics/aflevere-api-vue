import { isObj, isArr, count, each, isEmpty } from '../index'

/**
 * Extend an object or an array by multiple others.
 * The first is the base object and returned.
 * 
 * @param  {...any} obj multiple arrays or objects
 * @returns {object|array}
 */
export default function extend(...obj) {
  if (!count(obj)) return
  let base = obj.shift()
  let extend = []
  each(obj, (mixed) => {
    if (isEmpty(mixed)) {
      return
    } else if (isObj(mixed) || isArr(mixed)) {
      extend.push(mixed)
    } else {
      extend.push([ mixed ])
    }
  })
  if (isObj(base)) {
    return Object.assign(base, ...extend)
  } else if (isArr(base)) {
    return base.concat(...extend)
  }
  return base
}