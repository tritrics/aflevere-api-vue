import { extend, has, isEmpty, isEmail, toStr, isTrue } from '../../fn'
import { createBase } from './index'

export default function createEmail(def) {
  const inject = {
    type: 'email',
    value: has(def, 'value') ? toStr(def.value) : '',
    required: has(def, 'required') && isTrue(def.required) ? true : false,
    validate() {
      if (isEmpty(this.value)) {
        if (this.required) {
          return this.setValid('required')
        }
      } else if(!isEmail(this.value)) {
        return this.setValid('type')
      }
      return this.setValid()
    },
  }
  return extend(createBase(), inject)
}