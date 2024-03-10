import { isDate, isStr, pad } from '../index'

/**
 * Converts a date to a string in the given format.
 * 
 * Possible shortcuts:
 * [ yyyy, mm, dd, hh, ii, ss]
 * 
 * Intended for programmatical use, for user-output use functions
 * date.toLocaleDateString() and date.toLocaleTimeString()
 * 
 * @param {Date} date
 * @param {String} format of the output
 * @returns {Date}
 */
export default function dateToStr(date, format = 'yyyy-mm-dd hh:ii:ss') {
  if (isDate(date) && isStr(format)) {
    return format
      .replace('yyyy', date.getFullYear())
      .replace('mm',   pad(date.getMonth() + 1, 2))
      .replace('dd',   pad(date.getDate(), 2))
      .replace('hh',   pad(date.getHours(), 2))
      .replace('ii',   pad(date.getMinutes(), 2))
      .replace('ss',   pad(date.getSeconds(), 2))
  }
}