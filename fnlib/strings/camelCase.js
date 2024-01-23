import { wordsToArr, toStr } from '../index'

/**
 * Creates a camelCase from one or more strings.
 * Example: fooBar
 * 
 * @param  {...any} args 
 * @returns {string}
 */
export default function camelCase(...args) {
  const str = args.join(' ')
  const words = wordsToArr(str).map(word => word.toLowerCase())
  if (words.length > 0) {
    return words[0] + words.slice(1).map((val) => toStr(val).charAt(0).toUpperCase() + val.slice(1)).join('')
  }
  return ''
}