import { isStr, lower } from '../index'

const reg = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/i

/**
 * Check, if a value is a valid email address.
 * 
 * @param {mixed} val 
 * @returns {boolean}
 */
export default function isEmail(val) {
  return isStr(val) && reg.test(lower(val))
}