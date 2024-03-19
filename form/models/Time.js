import { extend, has, toStr, isTrue, isDate, isEmpty, toDate, dateRegExp, dateToStr } from '../../fn'
import { createBase } from './index'

export default function createTime(def) {
  const inject = {
    type: 'time',
    value: has(def, 'value') ? toStr(def.value) : '',
    required: has(def, 'required') && isTrue(def.required) ? true : false,
    format: dateRegExp('h:ii'),
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
      return date ? dateToStr(date, 'hh:ii') : ''
    },
  }
  inject.min = has(def, 'min') && isDate(def.min, null, null, false, inject.format) ? toDate(def.min, inject.format) : null
  inject.max = has(def, 'max') && isDate(def.max, null, null, false, inject.format) ? toDate(def.max, inject.format) : null
  return extend(createBase(), inject)
}