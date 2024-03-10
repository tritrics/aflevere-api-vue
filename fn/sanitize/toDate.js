import { isStr, isArr, toInt, has, dateRegExp } from '../index'

/**
 * Converts string to date.
 * [ yyyy, yy, mm, m, dd, d, hh, h, ii, i, ss, s ]
 * 
 * @param {mixed} val 
 * @param {RegExp,string} format
 * @returns {float}
 */
export default function toDate(val, format = 'yyyy-mm-dd') {
  if (val instanceof Date) { // if (Object.prototype.toString.call(val) === "[object Date]") {
    return res.groups.toString() !== 'Invalid Date' ? val : null
  } else if(!isStr(val)) {
    return null
  }
  const regExp = isStr(format, 1) ? dateRegExp(format) : format
  if (!(regExp instanceof RegExp)) {
    return null
  }
  const res = regExp.exec(val)
  if (!isArr(res) || !has(res, 'groups')) {
    return null
  }
  const date = new Date()
  if (res.groups.y) date.setFullYear(toInt(res.groups.y))
  if (res.groups.m) date.setMonth(toInt(res.groups.m) - 1)
  if (res.groups.d) date.setDate(toInt(res.groups.d))
  if (res.groups.h) date.setHours(toInt(res.groups.h))
  if (res.groups.i) date.setMinutes(toInt(res.groups.i))
  if (res.groups.s) date.setSeconds(toInt(res.groups.s))
  if (
    date.toString() !== 'Invalid Date' &&
    (!res.groups.y || date.getFullYear() === toInt(res.groups.y)) &&
    (!res.groups.m || date.getMonth() === toInt(res.groups.m) - 1) &&
    (!res.groups.d || date.getDate() === toInt(res.groups.d)) &&
    (!res.groups.h || date.getHours() === toInt(res.groups.h)) &&
    (!res.groups.i || date.getMinutes() === toInt(res.groups.i)) &&
    (!res.groups.s || date.getSeconds() === toInt(res.groups.s))
  ) {
    return date
  }
  return null
}