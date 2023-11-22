import getKeys from './getKeys'
import inArr from './inArr'

/**
 * lazy: true, if given key is only a subset of pressed keys
 */
export default function isKey(Event, key, lazy = false) {
  const keys = getKeys(Event, true, true, true, true)
  if (lazy) {
    return inArr(key.split('-'), keys)
  }
  return key === keys.join('-')
}