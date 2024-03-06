/**
 * Round float to a given decimal length.
 * 
 * @param {float} val 
 * @param {integer} dec 
 * @returns {float}
 */
export default function round(val, dec) {
  const i = (dec === undefined || dec < 0) ? 1 : 10 ** dec
  return Math.round(val * i) / i
}