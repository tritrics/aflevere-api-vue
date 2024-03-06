import { isElem, toInt } from '../index'

/**
 * Get the height of the given HTML element.
 * 
 * @param {HTMLElement} elem 
 * @returns {integer}
 */
export default function getElemHeight(elem) {
  return isElem(elem) ? toInt(getComputedStyle(elem).height.split('px')[0]) : 0
}