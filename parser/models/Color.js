import { extend, toBool } from '../../fnlib'
import { createBase } from './Base'

/**
 * Model for API field: color
 *
 * @param {object} obj the field data
 * @returns {object}
 */
export function createColor(obj) {
  const functions = {}
  
  const data = {
    $type: 'color',
    $format: obj.meta.format,
    $alpha: toBool(obj.meta.alpha),
    $value: obj.value,
  }
  return extend(createBase(), functions, data)
}
