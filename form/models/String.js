import { has, isTrue, isInt, isStr, toInt, toStr, isEmpty, extend } from '../../fn'
import { createBase } from './index'

export default function createString(def, parent = {}) {
  const inject = {
    type: 'string',
    value: has(def, 'value') ? toStr(def.value) : '',
    required: has(def, 'required') && isTrue(def.required) ? true : false,
    minlength: has(def, 'minlength') && isInt(def.minlength, 1, null, false) ? toInt(def.minlength) : null,
    maxlength: has(def, 'maxlength') && isInt(def.maxlength, 1, null, false) ? toInt(def.maxlength) : null,
    linebreaks: false,
    validate() {
      if (isEmpty(this.value)) {
        if (this.required) {
          return this.setValid('required')
        }
      } else if(!isStr(this.value, null, null, this.linebreaks)) {
        return this.setValid('type')
      } else if(this.minlength && !isStr(this.value, this.minlength)) {
        return this.setValid('minlength')
      } else if(this.maxlength && !isStr(this.value, null, this.maxlength)) {
        return this.setValid('maxlength')
      }
      return this.setValid()
    }
  }
  return extend(createBase(), inject, parent)
}
