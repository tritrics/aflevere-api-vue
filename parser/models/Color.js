import { toObj, toBool } from '../../fnlib'
import base from './Base'

export function createColor(obj) {
  const functions = {}
  
  const data = {
    $type: 'color',
    $format: obj.meta.format,
    $alpha: toBool(obj.meta.alpha),
    $value: obj.value,
  }
  return toObj(base, functions, data)
}
