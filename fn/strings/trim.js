import { isStr, regEsc } from '../index'

/**
 * Trim a string, like PHP from the following chars:
 * 
 * ' ' an ordinary space
 * \t a tab
 * \n a new line (line feed)
 * \r a carriage return
 * \0 the NUL-byte
 * \v a vertical tab
 * 
 * @param {string} val 
 * @param {boolean} left trim at left
 * @param {boolean} right trim at right
 * @param {string} chars additional (!) characters to trim
 * @returns {string}
 */
export default function trim(val, left = true, right = true, chars = '') {
  if (isStr(val)) {
    const search = regEsc(` \r\n\t\0\v${chars}`)
    const reg = []
    if (left) reg.push(`^[${search}]+`)
    if (right) reg.push(`[${search}]+$`)
    return val.replace(new RegExp(reg.join('|'), 'g'), '')
  }
  return ''
}