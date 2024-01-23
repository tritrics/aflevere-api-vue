import {isStr} from '../index'
import {regEsc} from '../index'

/**
 * Trim a string at the end, optionally with any character.
 * 
 * @param {string} val 
 * @param {string} chars 
 * @returns {string}
 */
export default function rtrim(val, chars = ' ') {
  if (isStr(val)) {
    return val.replace(new RegExp(`${regEsc(chars)}+$`), '')
  }
  return ''
}