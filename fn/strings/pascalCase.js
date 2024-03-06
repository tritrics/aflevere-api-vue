import { wordsToArr, toStr } from '../index'

/**
 * Creates a pascalCase from one or more strings.
 * Example: FooBar
 * 
 * @param  {...any} args 
 * @returns {string}
 */
export default function pascalCase(...args) {
  const str = args.join(' ')
  const words = wordsToArr(str).map(word => word.toLowerCase())
  if (words.length > 0) {
    return words.map((val) => toStr(val).charAt(0).toUpperCase() + val.slice(1)).join('')
  }
  return ''
}