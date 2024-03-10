import { ref, computed, watchEffect, inject } from 'vue'
import { createAction, subscribe, hasPlugin } from '../api'
import {
  each,
  has,
  lower,
  trim,
  camelCase,
  dateToStr,
  inArr,
  isArr,
  isBool,
  isDate,
  isEmpty,
  isEmail,
  isInt,
  isNum,
  isObj,
  isStr,
  isTrue,
  isUrl,
  toBool,
  toDate,
  toInt,
  toNum,
  toStr,
} from '../fn'

const Form = class {

  /**
   * Valid/supported Kirby field types
   */
  types = [ 'boolean', 'email', 'date', 'number', 'select', 'string', 'text', 'time', 'url' ]

  /**
   * The field definitions like given in constructor or from API
   */
  defs = {}

  /**
   * List of field with all properties
   */
  fields = ref({})

  /**
   * Options
   */
  options = ref({})

  /**
   * Flag to determine, wheather "error" property of each field is set or not
   */
  showErrors = ref(true)

  /**
   * Overall valid flag
   */
  valid = computed(() => {
    let res = true
    each(this.fields.value, (def) => {
      if (!def.valid) {
        res = false
      }
    })
    return res
  })

  /**
   * @param {object|string} mixed either field defintions or action to get them from
   * @param {object} options additional options
   */
  constructor(mixed, options = {}) {
    this.setOptions(options)
    if (isStr(mixed, 1)) {
      this.action = mixed
      this.defs = this.getFieldDefFromApi()
    } else if(isObj(mixed)) {
      this.defs = mixed
    }
    this.initFields()
  }

  /**
   * Setting options like action, locale
   * 
   * @param {object} options 
   * @return {void}
   */
  setOptions(options) {
    if (isObj(options)) {
      this.options.value = options
    }
    if (!has(this.options.value, 'locale') && hasPlugin('i18n')) {
      const i18n = inject('api.i18n')
      this.options.value.locale = i18n.getLocale()
    } else {
      this.options.value.locale = 'en-US'
    }
    subscribe('on-changed-locale', (locale) => {
      this.options.value.locale = locale
    })
  }

  /**
   * Request field definition from blueprint by given action
   * @TODO: request from Kirby
   * 
   * @param {string} node 
   */
  getFieldDefFromApi() {
    return {}
  }

  /**
   * Validation of all fields
   * 
   * @returns {void}
   */
  validate() {
    this.showErrors.value = false
    each(this.fields.value, (def, name) => {
      this.validateField(name)
    })
  }

  /**
   * Get values from fields in their native type (number, boolean, string)
   * 
   * @returns {object}
   */
  data() {
    const data = {}
    each(this.fields.value, (def, key) => {
      if (def.type === 'boolean') {
        data[key] = toBool(def.value)
      } else if (def.type === 'date') {
        const date = toDate(def.value, def.format)
        if (date) {
          data[key] = dateToStr(date, (def.time ? 'yyyy-mm-dd hh:ii' : 'yyyy-mm-dd'))
        } else {
          data[key] = ''
        }
      } else if (def.type === 'time') {
        const date = toDate(def.value, def.format)
        data[key] = date ? dateToStr(date, 'hh:ii') : ''
      } else if (def.type === 'number') {
        data[key] = toNum(def.value)
      } else if (has(def, 'multiple') && def.multiple) {
        data[key] = def.value.map(entry => toStr(entry))
      } else {
        data[key] = toStr(def.value)
      }
    })
    return data
  }

  /**
   * Send the field values to API
   * 
   * @returns {json}
   */
  async submit() {
    if (has(this.options.value, 'action') && isStr(this.options.value.action, 1)) {
      const options = {}
      if (has(this.options.value, 'lang') && isStr(this.options.value.lang, 1)) {
        options.lang = this.options.value.lang
      }
      return await createAction(this.options.value.action, this.data(), options)
    }
  }

  /**
   * Reset the field values
   * 
   * @return {void}
   */
  reset() {
    this.showErrors.value = true
    each(this.fields.value, (def, key) => {
      this.fields.value[key].stop()
    })
    this.initFields()
  }

  /**
   * Init all fields
   * 
   * @param {object} fields 
   */
  initFields() {
    each(this.defs, (def, key) => {

      // get Type
      let type = 'string'
      if (has(def, 'type') && inArr(lower(trim(def.type)), this.types)) {
        type = lower(trim(def.type))
      }

      // call init function
      const fn = camelCase('init', type)
      this.fields.value[key] = this[fn](def)
      this.fields.value[key].valid = true
      this.fields.value[key].error = computed(() => !this.fields.value[key].valid && !this.showErrors.value)
      this.fields.value[key].msg = ''

      // watcher
      this.fields.value[key].stop = watchEffect(() => {
        this.validateField(
          key,
          this.fields.value[key].value // important to kick off the watchEffect
        )
      })
    })
  }

  /**
   * Init boolean field
   * 
   * @param {object} def 
   * @returns object
   */
  initBoolean(def) {
    const res = {
      type: 'boolean'
    }
    res.value = has(def, 'value') && isTrue(def.value, false) ? true : false
    res.required = has(def, 'required') && isTrue(def.required) ? true : false
    return res
  }

  /**
   * Init date field
   * 
   * @param {object} def 
   * @returns object
   */
  initDate(def) {
    const res = {
      type: 'date'
    }
    res.value = has(def, 'value') ? toStr(def.value) : ''
    res.required = has(def, 'required') && isTrue(def.required) ? true : false
    res.time = has(def, 'time') && isTrue(def.time)
    res.format = res.time ? 'yyyy-mm-dd hh:ii' : 'yyyy-mm-dd'
    res.min = has(def, 'min') && isDate(def.min, null, null, false, 'yyyy-mm-dd') ? toDate(def.min, 'yyyy-mm-dd') : null
    res.max = has(def, 'max') && isDate(def.max, null, null, false, 'yyyy-mm-dd') ? toDate(def.max, 'yyyy-mm-dd') : null
    return res
  }

  /**
   * Init email field
   * 
   * @param {object} def 
   * @returns object
   */
  initEmail(def) {
    const res = {
      type: 'email'
    }
    res.value = has(def, 'value') ? toStr(def.value) : ''
    res.required = has(def, 'required') && isTrue(def.required) ? true : false
    return res
  }

  /**
   * Init number field
   * 
   * @param {object} def 
   * @returns object
   */
  initNumber(def) {
    const res = {
      type: 'number'
    }
    res.value = has(def, 'value') ? toStr(def.value) : ''
    res.required = has(def, 'required') && isTrue(def.required) ? true : false
    return res
  }

  /**
   * Init select field
   * 
   * @param {object} def 
   * @returns object
   */
  initSelect(def) {
    const res = {
      type: 'select'
    }
    res.multiple = has(def, 'multiple') && isTrue(def.multiple)
    if (res.multiple) { // allow also integers as strings
      res.min = has(def, 'min') && isInt(def.min, 1, null, false) ? toInt(def.min) : null
      res.max = has(def, 'max') && isInt(def.max, 1, null, false) ? toInt(def.max) : null
      res.value = has(def, 'value') && isArr(def.value) ? def.value : []
    } else {
      res.value = has(def, 'value') ? toStr(def.value) : ''
    }
    res.options = has(def, 'options') && isArr(def.options) ? def.options : []
    res.required = has(def, 'required') && isTrue(def.required) ? true : false
    return res
  }

  /**
   * Init string field
   * 
   * @param {object} def 
   * @returns object
   */
  initString(def) {
    const res = {
      type: 'string'
    }
    res.multiple = has(def, 'multiple') && isTrue(def.multiple)
    if (res.multiple) { // allow also integers as strings
      res.min = has(def, 'min') && isInt(def.min, 1, null, false) ? toInt(def.min) : null
      res.max = has(def, 'max') && isInt(def.max, 1, null, false) ? toInt(def.max) : null
      let value = isArr(def.value) ? def.value : []
      if (isInt(res.min, 1) && value.length < res.min) {
        res.value = value.concat(Array.from({length: res.min - value.length}, n => ''))
      } else if (isInt(res.max, 1) && value.length > res.max) {
        res.value = value.slice(0, res.max)
      } else {
        res.value = value
      }
    } else {
      res.value = has(def, 'value') ? toStr(def.value) : ''
    }
    res.required = has(def, 'required') && isTrue(def.required) ? true : false
    res.minlength = has(def, 'minlength') && isInt(def.minlength, 1, null, false) ? toInt(def.minlength) : null
    res.maxlength = has(def, 'maxlength') && isInt(def.maxlength, 1, null, false) ? toInt(def.maxlength) : null
    return res
  }

  /**
   * Init text field
   * 
   * @param {object} def 
   * @returns object
   */
  initText(def) {
    const res = {
      type: 'text'
    }
    res.value = has(def, 'value') ? toStr(def.value) : ''
    res.required = has(def, 'required') && isTrue(def.required) ? true : false
    res.minlength = has(def, 'minlength') && isInt(def.minlength, 1, null, false) ? toInt(def.minlength) : null
    res.maxlength = has(def, 'maxlength') && isInt(def.maxlength, 1, null, false) ? toInt(def.maxlength) : null
    return res
  }

  /**
   * Init time field
   * 
   * @param {object} def 
   * @returns object
   */
  initTime(def) {
    const res = {
      type: 'time'
    }
    res.value = has(def, 'value') ? toStr(def.value) : ''
    res.required = has(def, 'required') && isTrue(def.required) ? true : false
    res.format = 'hh:ii'
    res.min = has(def, 'min') && isDate(def.min, null, null, false, 'hh:ii') ? toDate(def.min, 'hh:ii') : null
    res.max = has(def, 'max') && isDate(def.max, null, null, false, 'hh:ii') ? toDate(def.max, 'hh:ii') : null
    return res
  }

  /**
   * Init url field
   * 
   * @param {object} def 
   * @returns object
   */
  initUrl(def) {
    const res = {
      type: 'url'
    }
    res.value = has(def, 'value') ? toStr(def.value) : ''
    res.required = has(def, 'required') && isTrue(def.required) ? true : false
    return res
  }

  /**
   * Standard validation method, checks for correnct type, required, min, max
   * 
   * @param {string} name the fieldname
   */
  validateField(key) {
    if (has(this.fields.value, key)) {
      const fn = camelCase('validate', this.fields.value[key].type)
      this.fields.value[key].valid = this[fn](this.fields.value[key])
    }
  }

  /**
   * [ true, false, "true", "false", 0, 1, "0", "1" ]
   * 
   * @param {object} def the field properties
   * @returns {boolean}
   */
  validateBoolean(def) {
    if (def.required) {
      return isTrue(def.value, false)
    } else {
      return isBool(def.value, false)
    }
  }

  /**
   * [ Date, "yyyy-mm-dd", "yyyy-mm-dd hh:ii" ]
   * 
   * @param {object} def the field properties
   * @returns {boolean}
   */
  validateDate(def) {
    if (def.required || !isEmpty(def.value)) {
      return isDate(def.value, def.min, def.max, false, def.format)
    }
    return true
  }

  /**
   * [ "foo@bar.com", "", null ]
   * 
   * @param {object} def the field properties
   * @returns {boolean}
   */
  validateEmail(def) {
    if (def.required || !isEmpty(def.value)) {
      return isEmail(def.value)
    }
    return true
  }

  /**
   * [ 123, 0.5, -3, "123", "0.5", "-3", "", null ]
   * 
   * @param {object} def the field properties
   * @returns {boolean}
   */
  validateNumber(def) {
    if (def.required || !isEmpty(def.value)) {
      return isNum(def.value, def.min, def.max, false)
    }
    res.min = has(def, 'min') && isInt(def.min, 1, null, false) ? toInt(def.min) : null
    res.max = has(def, 'max') && isInt(def.max, 1, null, false) ? toInt(def.max) : null
    return true
  }

  /**
   * [ value[s] from options ]
   * 
   * @param {object} def the field defintion
   * @returns {boolean}
   */
  validateSelect(def) {
    if (def.multiple) {
      if (def.required || def.value.length > 0) {
        return isArr(def.value, def.min, def.max) && inArr(def.value, def.options)
      }
    } else {
      if (def.required || !isEmpty(def.value)) {
        return inArr(def.value, def.options)
      }
    }
    return true
  }

  /**
   * [ "string", "", null ]
   * 
   * @param {object} def the field defintion
   * @returns {boolean}
   */
  validateString(def) {
    if (def.multiple) {
      if (def.required || def.value.length > 0) {
        const check = def.value.filter(n => isStr(n, def.minlength, def.maxlength))
        return isInt(check.length, def.min, def.max) && check.length === def.value.length
      }
    } else {
      if (def.required || !isEmpty(def.value)) {
        return isStr(def.value, def.minlength, def.maxlength)
      }
    }
    return true
  }

  /**
   * [ "string", "", null ]
   * 
   * @param {object} def the field properties
   * @returns {boolean}
   */
  validateText(def) {
    if (def.required || !isEmpty(def.value)) {
      return isStr(def.value, def.minlength, def.maxlength)
    }
    return true
  }

  /**
   * [ Date, "hh:ii" ]
   * 
   * @param {object} def the field properties
   * @returns {boolean}
   */
  validateTime(def) {
    if (def.required || !isEmpty(def.value)) {
      return isDate(def.value, def.min, def.max, false, def.format)
    }
    return true
  }

  /**
   * [ "http://domain.com", "", null ]
   * 
   * @param {object} def the field defintion
   * @return {boolean}
   */
  validateUrl(def) {
    if (def.required || !isEmpty(def.value)) {
      return isUrl(def.value)
    }
    return true
  }
}
export default Form 