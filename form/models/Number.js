import { extend, has, toStr, isTrue, isNum, toNum, isEmpty} from '../../fn'
import { createBase } from './index'

/**
 * Number field
 * Kirby: Number
 * 
 * @param {object} def 
 * @returns 
 */
export default function createNumber(def) {
  const inject = {
    type: 'number',
    value: has(def, 'value') ? toStr(def.value) : '',
    required: has(def, 'required') && isTrue(def.required) ? true : false,
    min: has(def, 'min') && isNum(def.min, 1, null, false) ? toNum(def.min) : null,
    max: has(def, 'max') && isNum(def.max, 1, null, false) ? toNum(def.max) : null,
    validate() {
      if (isEmpty(this.value)) {
        if (this.required) {
          return this.setValid('required')
        }
      } else if(!isNum(this.value, null, null, false)) {
        return this.setValid('type')
      } else if(this.min && !isNum(this.value, this.min, null, false)) {
        return this.setValid('min')
      } else if(this.max && !isNum(this.value, null, this.max, false)) {
        return this.setValid('max')
      }
      return this.setValid()
    },
    data() {
      return toNum(this.value)
    }
  }
  return extend(createBase(), inject)
}