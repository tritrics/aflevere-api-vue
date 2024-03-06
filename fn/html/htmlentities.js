import { toStr } from '../index'

/**
 * Convert special html entities
 * 
 * Quote handling (like PHP):
 * 
 *   compat:   Will convert double-quotes and leave single-quotes alone
 *   quotes:   Will convert both double and single quotes
 *   noquotes: Will leave both double and single quotes unconverted
 * 
 * @param {string} str 
 * @param {string} quotes [ compat | quotes | noquotes ]
 * @returns 
 */
export default function htmlentities(str, quotes = 'compat') {
  let res = toStr(str).replace(/&/g, '&amp;').replace(/</g, '&#60;').replace(/>/g, '&#62;')
  if (quotes === 'compat' || quotes === 'quotes') {
    res = res.replace(/"/g, '&#34;')
  }
  if (quotes === 'quotes') {
     res = res.replace(/'/g, '&#039;')
  }
  return res
}