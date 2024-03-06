import { toFloat, isInt } from '../index'

/**
 * Round up a float to a given decimal length.
 * 
 * @param {float} val 
 * @param {integer} dec 
 * @returns {float}
 */
export default function ceil(val, dec) {
  const i = isInt(dec, 1) ? 10 ** dec : 1
  return Math.ceil(toFloat(val) * i) / i
}