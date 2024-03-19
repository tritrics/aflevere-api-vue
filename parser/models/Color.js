import { extend, toBool } from '../../fn'
import { createBase } from './index'

/**
 * Model for API field: color
 *
 * @param {object} obj the field data
 * @returns {object}
 */
export default function createColor(obj) {
  const functions = {}
  
  const data = {
    $type: 'color',
    $format: obj.meta.format,
    $alpha: toBool(obj.meta.alpha),
    $value: obj.value,
  }
  return extend(createBase(), functions, data)
}
