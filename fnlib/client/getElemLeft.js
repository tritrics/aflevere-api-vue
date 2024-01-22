import { isElem, toInt } from '../index'

/**
 * Get left position of the given HTML element relative to the viewport.
 * 
 * @param {HTMLElement} elem 
 * @returns {integer}
 */
export default function getElemLeft(elem) {
  return isElem(elem) ? toInt(elem.offsetLeft) : 0
}