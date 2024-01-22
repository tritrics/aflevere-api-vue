import { isElem, getElemWidth, getElemLeft } from '../index'

/**
 * Get right position of the given HTML element relative to the viewport.
 * 
 * @param {HTMLElement} elem 
 * @returns {integer}
 */
export default function getElemRight(elem) {
  return isElem(elem) ? getElemLeft(elem) + getElemWidth(elem) : 0
}