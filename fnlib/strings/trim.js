import ltrim from './ltrim'
import {rtrim} from '../index'

/**
 * Trim a string at the beginning and the end, optionally with any character.
 * 
 * @param {string} val 
 * @param {string} chars 
 * @returns {string}
 */
export default function trim(val, chars = ' ') {
  return rtrim(ltrim(val, chars), chars)
}