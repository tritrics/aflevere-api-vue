import { extend } from '../../fn'
import { createBase } from './Base'

export function createNumber(def) {
  const inject = {
    type: 'number',
    value: def.value,
    validate() {
    },
    data() {},
    toString() {},
  }

  const obj = extend(createBase(), inject)
  obj.watchStart()
  return obj
}
