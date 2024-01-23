import { isArr } from '../index'

/**
 * Makes an array unique.
 * 
 * @param {array} arr 
 * @returns {array}
 */
export default function unique(arr) {
  return isArr(arr) ? [...new Set(arr)] : []
}