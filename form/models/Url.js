import { extend } from '../../fn'
import { createBase } from './Base'

export function createUrl(def) {
  const inject = {
    type: 'url',
    value: def.value,
    validate() {
    },
  }

  const obj = extend(createBase(), inject)
  obj.watchStart()
  return obj
}
