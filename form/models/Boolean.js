import { extend, isTrue, isBool } from '../../fn'
import { createBase } from './Base'

export function createBoolean(def) {
  const inject = {
    type: 'boolean',
    value: has(def, 'value') && isTrue(def.value, false) ? true : false,
    required: has(def, 'required') && isTrue(def.required) ? true : false,
    validate() {
      if (this.required && !isTrue(this.value, false)) {
        return 'required'
      } else if (!isBool(this.value, false)) {
        return 'type'
      }
      return true
    },
    data() {},
    toString() {},
  }

  const obj = extend(createBase(), inject)
  obj.watchStart()
  return obj
}
