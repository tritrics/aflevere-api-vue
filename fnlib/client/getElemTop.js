import { isElem, toInt } from '../index'

/**
 * Get top position of the given HTML element relative to the viewport.
 * 
 * @param {HTMLElement} elem 
 * @returns {integer}
 */
export default function getElemTop(elem) {
  return isElem(elem) ? toInt(elem.getBoundingClientRect().top)  : 0
}