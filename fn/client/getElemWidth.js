import { isElem, getElem, toInt } from '../index'

/**
 * Get the width of the given HTML element.
 * 
 * @param {HTMLElement} elem 
 * @returns {integer}
 */
export default function getElemWidth(elem) {
  return isElem(elem) ? toInt(getComputedStyle(elem).width.split('px')[0]) : 0
}