/**
 * Check, if value i a function.
 * 
 * @param {mixed} val 
 * @returns {boolean}
 */
export default function isFunc(val) {
  return val && (typeof val === 'function' || {}.toString.call(val) === '[object Function]')
}