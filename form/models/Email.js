import { extend } from '../../fn'
import { createBase } from './Base'

export function createEmail(def) {
  const inject = {
    type: 'email',
    value: def.value,
    validate() {
    },
  }

  const obj = extend(createBase(), inject)
  obj.watchStart()
  return obj
}
