import { extend } from '../../fn'
import { createBase } from './Base'

export function createDate(def) {
  const inject = {
    type: 'date',
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
