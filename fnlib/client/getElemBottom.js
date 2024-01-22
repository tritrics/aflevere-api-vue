import { isElem, toInt } from '../index'

/**
 * Get bottom position of the given HTML element relative to the viewport.
 * 
 * @param {HTMLElement} elem 
 * @returns {integer}
 */
export default function getElemBottom(elem) {
  return isElem(elem) ? toInt(elem.getBoundingClientRect().bottom) : 0
}