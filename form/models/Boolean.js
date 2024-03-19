import { extend, has, isTrue, isBool } from '../../fn'
import { createBase } from './index'

export default function createBoolean(def) {
  const inject = {
    type: 'boolean',
    value: has(def, 'value') && isTrue(def.value, false) ? true : false,
    required: has(def, 'required') && isTrue(def.required) ? true : false,
    validate() {
      if (this.required && !isTrue(this.value, false)) {
        return this.setValid('required')
      } else if (!isBool(this.value, false)) {
        return this.setValid('type')
      }
      return this.setValid()
    },
    data() {
      return isTrue(this.value, false) ? 1 : 0
    },
  }
  return extend(createBase(), inject)
}
