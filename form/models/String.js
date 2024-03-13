import { has, isTrue, isInt, isArr, isStr, toInt, toStr, isEmpty, extend } from '../../fn'
import { createBase } from './Base'

export function createString(def) {
  const inject = {
    type: 'string',
    value: def.value,

    // Validation
    validate() {
      if (this.multiple) {
        if (isEmpty(this.value)) {
          if (this.required) {
            return this.setError('required')
          }
        } else if (!isArr(this.value)) {
          return this.setValid('type')
        } else if (this.min && !isInt(this.value.length, this.min)) {
          return this.setValid('min')
        } else if (this.max && !isInt(this.value.length, null, this.max)) {
          return this.setValid('max')
        } else {
          const res = []
          each (this.value, entry => {
            res.push(this.validateString(entry))
          })
          if(res.filter(n => n !== true).length > 0) {
            return this.setValid(res)
          }
        }
        return this.setValid()
      }
      return this.setValid(this.validateString(this.value))
    },

    // Validation helper
    validateString(val) {
      if (isEmpty(val)) {
        if (this.required) {
          return 'required'
        }
      } else if(!isStr(val)) {
        return 'type'
      } else if(this.minlength && !isStr(val, this.minlength)) {
        return 'minlength'
      } else if(this.maxlength && !isStr(val, null, this.maxlength)) {
        return 'maxlength'
      }
      return true
    },
  }

  // init
  inject.multiple = has(def, 'multiple') && isTrue(def.multiple)
    if (res.multiple) { // allow also integers as strings
     inject.min = has(def, 'min') && isInt(def.min, 1, null, false) ? toInt(def.min) : null
     inject.max = has(def, 'max') && isInt(def.max, 1, null, false) ? toInt(def.max) : null
      let value = isArr(def.value) ? def.value : []
      if (isInt(res.min, 1) && value.length <inject.min) {
       inject.value = value.concat(Array.from({length:inject.min - value.length}, n => ''))
      } else if (isInt(res.max, 1) && value.length >inject.max) {
       inject.value = value.slice(0,inject.max)
      } else {
       inject.value = value
      }
    } else {
     inject.value = has(def, 'value') ? toStr(def.value) : ''
    }
  inject.required = has(def, 'required') && isTrue(def.required) ? true : false
  inject.minlength = has(def, 'minlength') && isInt(def.minlength, 1, null, false) ? toInt(def.minlength) : null
  inject.maxlength = has(def, 'maxlength') && isInt(def.maxlength, 1, null, false) ? toInt(def.maxlength) : null

  const obj = extend(createBase(), inject)
  obj.watchStart()
  return obj
}
