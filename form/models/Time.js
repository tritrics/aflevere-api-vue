import { extend } from '../../fn'
import { createBase } from './Base'

export function createTime(def) {
  const inject = {
    type: 'time',
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
