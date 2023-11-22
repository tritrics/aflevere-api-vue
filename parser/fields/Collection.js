import { has, each, isStr, toObj } from '../../fnlib'
import base from './Base'

/**
 * Collection is the parent node for a set of pages like it is
 * selected with children() (not for fieldtype pages)
 */
export function createCollection(obj) {
  const functions = { }
  
  let data = {
    _type: 'collection',
    _meta: obj.meta,
    _value: obj.value,
  }
  return toObj(base, functions, data)
}