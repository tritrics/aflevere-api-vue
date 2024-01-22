import { isStr } from '../index'

/**
 * Check, if value is a valid url.
 * 
 * @param {mixed} val 
 * @returns {boolean}
 */
export default function isUrl(val) {
  try { 
    return isStr(val) && Boolean(new URL(val))
  } catch(e) { 
    return false;
  }
}