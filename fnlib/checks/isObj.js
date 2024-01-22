/**
 * Check, if value is of type object (strict) or type argument.
 * 
 * @param {mixed} val 
 * @returns {boolean}
 */
export default function isObj(val) { // experimental
  const check = Object.prototype.toString.call(val).toLowerCase()
  return check === '[object object]' || check === '[object arguments]'
}