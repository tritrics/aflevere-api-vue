import { wordsToArr } from '../index'

/**
 * foo-bar
 */
export default function kebabCase(...args) {
  const str = args.join(' ')
  const words = wordsToArr(str).map(word => word.toLowerCase())
  return words.join('-')
}