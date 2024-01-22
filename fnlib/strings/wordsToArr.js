import {toStr} from '../index'

/**
 * splits also FooBar, fooBar, foo-bar, foo_bar
 */
export default function wordsToArr (str) {
  return toStr(str).replace(/([A-Z])/g, ' $1').match(/\b(\w+)\b/g)
}