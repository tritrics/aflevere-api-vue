import { toFloat, isInt } from '../index'

/**
 * Round down a float to a given decimal length.
 * 
 * @param {float} val 
 * @param {integer} dec 
 * @returns {float}
 */
export default function floor(val, dec) {
  const i = isInt(dec, 1) ? 10 ** dec : 1
  return Math.floor(toFloat(val) * i) / i
}