import { watchEffect } from 'vue'
import { extend, has, each, unset, isTrue, isInt, isArr, toInt, isEmpty } from '../../fn'
import { createBase, createString } from './index'

export default function createList(def) {
  const inject = {
    type: 'list',
    value: [],
    required: has(def, 'required') && isTrue(def.required) ? true : false,
    min: has(def, 'min') && isInt(def.min, 1, null, false) ? toInt(def.min) : null,
    max: has(def, 'max') && isInt(def.max, 1, null, false) ? toInt(def.max) : null,
    minlength: has(def, 'minlength') && isInt(def.minlength, 1, null, false) ? toInt(def.minlength) : null,
    maxlength: has(def, 'maxlength') && isInt(def.maxlength, 1, null, false) ? toInt(def.maxlength) : null,
    validate() {
      each (this.value, field => {
        field.validate()
      })
      if (isEmpty(this.value)) {
        if (this.required) {
          return this.setValid('required')
        }
      } else if (!isArr(this.value)) {
        return this.setValid('type')
      } else if (this.min && !isInt(this.value.length, this.min)) {
        return this.setValid('min')
      } else if (this.max && !isInt(this.value.length, null, this.max)) {
        return this.setValid('max')
      }
      return this.setValid()
    },
    add(value = '') {
      this.value.push(createString({
        value: value,
        required: true,
        minlength: this.minlength,
        maxlength: this.maxlength,
      }, {
        parent: this,
        remove() {
          this.parent.remove(this.id)
        }
      }))
    },
    remove(id) {
      for (let key = 0; key < this.value.length; key++) {
        if (this.value[key].id === id) {
          this.value[key].watch(false)
          unset(this.value, key)
          return
        }
      }
    },
    data() {
      return this.value.map(entry => entry.data())
    },
    toString() {
      this.data().toString()
    },
    watch(start = true) {
      if (start) {
        if(this._watchStopFn === null) {
          this._watchStopFn = watchEffect(() => {
            this.validate(this.value) // important to kick off the watchEffect
          })
        }
      } else if (this._watchStopFn !== null) {
        this._watchStopFn()
        this._watchStopFn = null
      }
      each(this.value, (field) => {
        field.watch(start)
      })
    },
  }

  // create fields
  let values = isArr(def.value) ? def.value : []
  if (isInt(inject.min, 1) && values.length < inject.min) {
    values = values.concat(Array.from({ length:inject.min - values.length }, n => ''))
  } else if (isInt(inject.max, 1) && values.length > inject.max) {
    values = values.slice(0, inject.max)
  }
  each(values, (value) => {
    inject.add(value)
  })
  return extend(createBase(), inject)
}
