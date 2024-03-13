import { extend } from '../../fn'
import { createBase } from './Base'

export function createSelect(def) {
  const inject = {
    type: 'select',
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
