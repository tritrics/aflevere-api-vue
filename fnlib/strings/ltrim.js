import { isStr, regEsc } from '../index'

/**
 * Trim a string at the beginning, optionally with any character.
 * 
 * @param {string} val 
 * @param {string} chars 
 * @returns {string}
 */
export default function ltrim(val, chars = ' ') {
  if (isStr(val)) {
    return val.replace(new RegExp(`^${regEsc(chars)}+`), '')
  }
  return ''
}