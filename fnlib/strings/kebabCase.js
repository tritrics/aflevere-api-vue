import { wordsToArr } from '../index'

/**
 * Creates a kebabCase from one or more strings.
 * Example: foo-bar
 * 
 * @param  {...any} args 
 * @returns {string}
 */
export default function kebabCase(...args) {
  const str = args.join(' ')
  const words = wordsToArr(str).map(word => word.toLowerCase())
  return words.join('-')
}