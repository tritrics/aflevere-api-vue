import wordsToArr from './wordsToArr'

/**
 * Creates a snakeCase from one or more strings.
 * Example: foo_bar
 * 
 * @param  {...any} args 
 * @returns {string}
 */
export default function snakeCase(...args) {
  const str = args.join(' ')
  const words = wordsToArr(str).map(word => word.toLowerCase())
  return words.join('_')
}