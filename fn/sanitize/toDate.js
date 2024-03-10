import { regEsc, isStr, isArr, toInt, has } from '../index'

/**
 * Converts string to date.
 * [ yyyy, mm, dd, hh, ii, ss ]
 * 
 * @param {mixed} val 
 * @param {string} format a possible date string has
 * @returns {float}
 */
export default function toDate(val, format = 'yyyy-mm-dd') {
  if (val instanceof Date) { // if (Object.prototype.toString.call(val) === "[object Date]") {
    return val.toString() !== 'Invalid Date' ? val : null
  }
  if(isStr(val) && isStr(format, 1)) {
    let search = 
      `^${regEsc(format.toLowerCase())}$`
        .replace('yyyy', '(?<y>\\d{4})')
        .replace('mm', '(?<m>\\d{2})')
        .replace('dd', '(?<d>\\d{2})')
        .replace('hh', '(?<h>\\d{2})')
        .replace('ii', '(?<i>\\d{2})')
        .replace('ss', '(?<s>\\d{2})')
    const res = RegExp(search).exec(val)
    if (isArr(res) && has(res, 'groups')) {
      const val = {
        y: has(res.groups, 'y') ? toInt(res.groups.y) : null,
        m: has(res.groups, 'm') ? toInt(res.groups.m) - 1 : null,
        d: has(res.groups, 'd') ? toInt(res.groups.d) : null,
        h: has(res.groups, 'h') ? toInt(res.groups.h) : null,
        i: has(res.groups, 'i') ? toInt(res.groups.i) : null,
        s: has(res.groups, 's') ? toInt(res.groups.s) : null
      }
      const date = new Date()
      if (val.y !== null) date.setFullYear(val.y)
      if (val.m !== null) date.setMonth(val.m)
      if (val.d !== null) date.setDate(val.d)
      if (val.h !== null) date.setHours(val.h)
      if (val.i !== null) date.setMinutes(val.i)
      if (val.s !== null) date.setSeconds(val.s)
      if (
        date.toString() !== 'Invalid Date' &&
        (val.y === null || date.getFullYear() === val.y) &&
        (val.m === null || date.getMonth() === val.m) &&
        (val.d === null || date.getDate() === val.d) &&
        (val.h === null || date.getHours() === val.h) &&
        (val.i === null || date.getMinutes() === val.i) &&
        (val.s === null || date.getSeconds() === val.s)
      ) {
        return date
      }
    }
  }
  return null
}