import { extend, has, isTrue, isInt, toInt, isArr, toStr, isEmpty, inArr } from '../../fn'
import { createBase } from './index'

/**
 * Select/Multiselect field
 * Kirby: Checkboxes, Multiselect, Radio, Select, Toggles
 * 
 * @param {object} def 
 * @returns 
 */
export default function createSelect(def) {
  const inject = {
    type: 'select',
    multiple: has(def, 'multiple') && isTrue(def.multiple),
    options: has(def, 'options') && isArr(def.options) ? def.options : [],
    required: has(def, 'required') && isTrue(def.required) ? true : false,
    validate() {
      if (isEmpty(this.value)) {
        if (this.required) {
          return this.setValid('required')
        }
      } else if (!inArr(this.value, this.options)) {
        return this.setValid('type')
      } else if (this.multiple) {
        if (this.min && !isInt(this.value.length, this.min)) {
          return this.setValid('min')
        } else if (this.max && !isInt(this.value.length, null, this.max)) {
          return this.setValid('max')
        }
      }
      return this.setValid()
    },
    data() {
      if (this.multiple) {
        return this.value.map(entry => toStr(entry))
      } else {
        return toStr(this.value)
      }
    },
    toString() {
      const res = this.data()
      return isArr(res) ? res.toString() : res
    }
  }
  if (inject.multiple) {
    inject.value = has(def, 'value') && isArr(def.value) ? def.value : []
    inject.min = has(def, 'min') && isInt(def.min, 1, null, false) ? toInt(def.min) : null
    inject.max = has(def, 'max') && isInt(def.max, 1, null, false) ? toInt(def.max) : null
  } else {
    inject.value = has(def, 'value') ? toStr(def.value) : ''
  }
  return extend(createBase(), inject)
}