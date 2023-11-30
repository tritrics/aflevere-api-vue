import { toObj } from '../../fnlib'
import base from './Base'

/**
 * Collection is the parent node for a set of pages like it is
 * selected with children() (not for fieldtype pages)
 */
export function createNodes(obj) {
  const functions = { }
  
  let data = {
    _type: 'nodes',
    _meta: obj.meta,
    _value: obj.value,
  }
  return toObj(base, functions, data)
}