/**
 * Check, if value is of type object (strict) or type argument.
 * 
 * @param {mixed} val 
 * @returns {boolean}
 */
export default function isObj(val) {
  return /^\[object (object|arguments|module)\]$/.test(Object.prototype.toString.call(val).toLowerCase())
}