import { has, toObj } from '../../fnlib'
import base from './Base'
import { createString } from './String'

export function createOption(obj) {
  const functions = {}
  
  const data = {
    $type: 'option',
    $value: obj.value,
  }
  if (has(obj, 'label')) {
    data.label = createString(obj.label)
  }
  return toObj(base, functions, data)
}
