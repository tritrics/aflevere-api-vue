import wordsToArr from "./wordsToArr"
import toStr from './toStr'

/**
 * FooBar
 */
export default function pascalCase(...args) {
  const str = args.join(' ')
  const words = wordsToArr(str).map(word => word.toLowerCase())
  if (words.length > 0) {
    return words.map((val) => toStr(val).charAt(0).toUpperCase() + val.slice(1)).join('')
  }
  return ''
}