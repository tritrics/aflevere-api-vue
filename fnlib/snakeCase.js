import wordsToArr from './wordsToArr'

/**
 * foo_bar
 */
export default function snakeCase(...args) {
  const str = args.join(' ')
  const words = wordsToArr(str).map(word => word.toLowerCase())
  return words.join('_')
}