import { extend, has, toStr, isTrue, isStr, dateRegExp, isEmpty, isDate, toDate, dateToStr } from '../../fn'
import { createBase } from './index'

/**
 * Date field, optional with time
 * Kirby: Date
 * 
 * @param {object} def 
 * @returns 
 */
export default function createDate(def) {
  const inject = {
    type: 'date',
    value: has(def, 'value') ? toStr(def.value) : '',
    required: has(def, 'required') && isTrue(def.required) ? true : false,
    time: has(def, 'time') && isTrue(def.time),
    format: has(def, 'format') && isStr(def.format, 1) ? dateRegExp(def.format) : dateRegExp('yyyy-mm-dd'),
    validate() {
      if (isEmpty(this.value)) {
        if (this.required) {
          return this.setValid('required')
        }
      } else if(!isDate(this.value, null, null, false, this.format)) {
        return this.setValid('type')
      } else if(this.min && !isDate(this.value, this.min, null, false, this.format)) {
        return this.setValid('min')
      } else if(this.max && !isDate(this.value, null, this.max, false, this.format)) {
        return this.setValid('max')
      }
      return this.setValid()
    },
    data() {
      const date = toDate(this.value, this.format)
      return date ? dateToStr(date, 'yyyy-mm-dd hh:ii') : ''
    },
  }
  inject.min = has(def, 'min') && isDate(def.min, null, null, false, inject.format) ? toDate(def.min, inject.format) : null
  inject.max = has(def, 'max') && isDate(def.max, null, null, false, inject.format) ? toDate(def.max, inject.format) : null
  return extend(createBase(), inject)
}