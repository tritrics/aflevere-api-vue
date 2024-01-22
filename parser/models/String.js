import { isObj, has, isStr, isNum, isBool, toBool, toStr, toObj } from '../../fnlib'
import base from './Base'

/**
 * Model for all remaining API fields without own model
 * Object can handle all different data types
 * 
 * @param {mixed} mixed 
 * @returns {object}
 */
export function createString(mixed) {
  let value = (isObj(mixed) && has(mixed, 'value')) ? mixed.value : mixed
  if (!isStr(value)) {
    if (isNum(mixed)) {
      value = toStr(mixed)
    } else if (isBool(mixed)) {
      value = toBool(mixed) ? 'true' : 'false'
    } else {
      value = null
    }
  }

  const functions = {}
  
  const data = {
    $type: 'string',
    $value: value,
  }
  return toObj(base, functions, data)
}
