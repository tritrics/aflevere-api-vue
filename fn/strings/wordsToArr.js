import { toStr } from '../index'

/**
 * Return words in a string as array.
 * Splits also FooBar, fooBar, foo-bar, foo_bar.
 * 
 * @param {string} str 
 * @returns {array}
 */
export default function wordsToArr (str) {
  return toStr(str).replace(/([A-Z])/g, ' $1').match(/\b(\w+)\b/g)
}