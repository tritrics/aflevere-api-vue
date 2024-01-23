import { isInt, regEsc } from '../index'

/**
 * Create a test-regex for numbers
 * 
 * @param {Integet} decimals [ 0 for integer, >0 for float with fixed, * for infinite ]
 * @return {RegExp}
 */
export default function numberRegEx (decimals, decPoint = '.') {
  var res = '^(\\d)*' // thousandSep-test: '^\\d{1,3}([,]?\\d{3})*'
  if (isInt(decimals, 1)) {
    res += `(${regEsc(decPoint)}\d{0,${decimals}})?`
  } else if (decimals === '*') {
    res += `(${regEsc(decPoint)}\d*)?`
  }
  return new RegExp(res +'$')
}