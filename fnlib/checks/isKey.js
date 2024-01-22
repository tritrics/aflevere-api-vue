import { getKeys, inArr } from '../index'

/**
 * Check, if a given key is pressed.
 * 
 * @param {Event} Event 
 * @param {string} key the key-combination to check against
 * @param {boolean} strict if set to false, a subset is also accepted
 * @returns {boolean}
 * @see getKeys() for details
 */
export default function isKey(Event, key, strict = true) {
  const keys = getKeys(Event, true, true, true, true)
  if (!strict) {
    return inArr(key.split('-'), keys)
  }
  return key === keys.join('-')
}