import { isStr, isObj, has } from '../index'

/**
 * Tries to find an HTML element.
 * 
 * @param {mixed} mixed 
 * @returns {HTMLElement|null}
 */
export default function getElem(mixed) {
  if (mixed instanceof HTMLElement || mixed === window) {
    return mixed
  } else if (isStr(mixed)) {
    return document.getElementById(mixed)
  } else if (isObj(mixed) && has(mixed, '$el')) {
    return mixed.$el
  }
  return null
}