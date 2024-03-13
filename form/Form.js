import { ref, computed, watchEffect } from 'vue'
import { createAction } from '../api'
import {
  each,
  has,
  lower,
  trim,
  camelCase,
  dateToStr,
  dateRegExp,
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
   * Plugin-options
   */
  options = ref({})

  /**
   * Flag to determine, wheather error-property of each field is set or not
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
   * Setting options
   * 
   * @param {object} options 
   * @return {void}
   */
  setOptions(options) {
    if (isObj(options)) {
      this.options.value = options
    }
    // locale - useful for date fields, but not used at the moment
    // if (!has(this.options.value, 'locale') && hasPlugin('i18n')) {
    //   const i18n = inject('api.i18n')
    //   this.options.value.locale = i18n.getLocale()
    // } else {
    //   this.options.value.locale = 'en-US'
    // }
    // subscribe('on-changed-locale', (locale) => {
    //   this.options.value.locale = locale
    // })
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
        data[key] = date ? dateToStr(date, 'yyyy-mm-dd hh:ii') : ''
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
    this.fields.value = {}
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
   * Standard validation method, checks for correnct type, required, min, max
   * 
   * @param {string} name the fieldname
   */
  validateField(key) {
    if (has(this.fields.value, key)) {
      const fn = camelCase('validate', this.fields.value[key].type)
      const res = this[fn](this.fields.value[key])
      if (res === true) {
        this.fields.value[key].valid = true
        this.fields.value[key].msg = null
      } else {
        this.fields.value[key].valid = false
        this.fields.value[key].msg = res
      }
    }
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
   * [ true, false, "true", "false", 0, 1, "0", "1" ]
   * 
   * @param {object} def the field properties
   * @returns {string|boolean}
   */
  validateBoolean(def) {
    if (def.required && !isTrue(def.value, false)) {
      return 'required'
    } else if (!isBool(def.value, false)) {
      return 'type'
    }
    return true
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
    if (has(def, 'format') && isStr(def.format, 1)) {
      res.format = dateRegExp(def.format)
    } else {
      res.format = dateRegExp('yyyy-mm-dd')
    }
    res.min = has(def, 'min') && isDate(def.min, null, null, false, def.format) ? toDate(def.min, def.format) : null
    res.max = has(def, 'max') && isDate(def.max, null, null, false, def.format) ? toDate(def.max, def.format) : null
    return res
  }

  /**
   * [ Date, "yyyy-mm-dd", "yyyy-mm-dd hh:ii" ]
   * 
   * @param {object} def the field properties
   * @returns {string|boolean}
   */
  validateDate(def) {
    if (isEmpty(def.value)) {
      if (def.required) {
        return 'required'
      }
    } else if(!isDate(def.value, null, null, false, def.format)) {
      return 'type'
    } else if(def.min && !isDate(def.value, def.min, null, false, def.format)) {
      return 'min'
    } else if(def.max && !isDate(def.value, null, def.max, false, def.format)) {
      return 'max'
    }
    return true
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
   * [ "foo@bar.com", "", null ]
   * 
   * @param {object} def the field properties
   * @returns {string|boolean}
   */
  validateEmail(def) {
    if (isEmpty(def.value)) {
      if (def.required) {
        return 'required'
      }
    } else if(!isEmail(def.value)) {
      return 'type'
    }
    return true
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
    res.min = has(def, 'min') && isInt(def.min, 1, null, false) ? toInt(def.min) : null
    res.max = has(def, 'max') && isInt(def.max, 1, null, false) ? toInt(def.max) : null
    return res
  }

  /**
   * [ 123, 0.5, -3, "123", "0.5", "-3", "", null ]
   * 
   * @param {object} def the field properties
   * @returns {string|boolean}
   */
  validateNumber(def) {
    if (isEmpty(def.value)) {
      if (def.required) {
        return 'required'
      }
    } else if(!isNum(def.value, null, null, false)) {
      return 'type'
    } else if(def.min && !isNum(def.value, def.min, null, false)) {
      return 'min'
    } else if(def.max && !isNum(def.value, null, def.max, false)) {
      return 'max'
    }
    return true
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
   * [ value[s] from options ]
   * 
   * @param {object} def the field defintion
   * @returns {string|boolean}
   */
  validateSelect(def) {
    if (isEmpty(def.value)) {
      if (def.required) {
        return 'required'
      }
    } else if (!inArr(def.value, def.options)) {
      return 'type'
    } else if (def.multiple) {
      if (def.min && !isInt(def.value.length, def.min)) {
        return 'min'
      } else if (def.max && !isInt(def.value.length, null, def.max)) {
        return 'max'
      }
    }
    return true
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
   * [ "string", "", null ]
   * 
   * @param {object} def the field defintion
   * @returns {string|array|boolean}
   */
  validateString(def) {
    if (def.multiple) {
      if (isEmpty(def.value)) {
        if (def.required) {
          return 'required'
        }
      } else if (!isArr(def.value)) {
        return 'type'
      } else if (def.min && !isInt(def.value.length, def.min)) {
        return 'min'
      } else if (def.max && !isInt(def.value.length, null, def.max)) {
        return 'max'
      } else {
        const res = []
        each (def.value, entry => {
          res.push(this.validateDefault(entry, def))
        })
        if(res.filter(n => n !== true).length > 0) {
          return res
        }
      }
      return true
    }
    return this.validateDefault(def.value, def)
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
   * [ "string", "", null ]
   * 
   * @param {object} def the field properties
   * @returns {string|boolean}
   */
  validateText(def) {
    return this.validateDefault(def.value, def)
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
    res.format = 'h:ii'
    res.min = has(def, 'min') && isDate(def.min, null, null, false, 'h:ii') ? toDate(def.min, 'h:ii') : null
    res.max = has(def, 'max') && isDate(def.max, null, null, false, 'h:ii') ? toDate(def.max, 'h:ii') : null
    return res
  }

  /**
   * [ Date, "hh:ii" ]
   * 
   * @param {object} def the field properties
   * @returns {string|boolean}
   */
  validateTime(def) {
    if (isEmpty(def.value)) {
      if (def.required) {
        return 'required'
      }
    } else if(!isDate(def.value, null, null, false, def.format)) {
      return 'type'
    } else if(def.min && !isDate(def.value, def.min, null, false, def.format)) {
      return 'min'
    } else if(def.max && !isDate(def.value, null, def.max, false, def.format)) {
      return 'max'
    }
    return true
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
   * [ "http://domain.com", "", null ]
   * 
   * @param {object} def the field defintion
   * @returns {string|boolean}
   */
  validateUrl(def) {
    if (isEmpty(def.value)) {
      if (def.required) {
        return 'required'
      }
    } else if(!isUrl(def.value)) {
      return 'type'
    }
    return true
  }

  /**
   * Default validation for a string value
   * [ "string", "", null ]
   * 
   * @param {object} def the field defintion
   * @returns {string|boolean}
   */
  validateDefault(value, def) {
    if (isEmpty(value)) {
      if (def.required) {
        return 'required'
      }
    } else if(!isStr(value)) {
      return 'type'
    } else if(def.minlength && !isStr(value, def.minlength)) {
      return 'minlength'
    } else if(def.maxlength && !isStr(value, null, def.maxlength)) {
      return 'maxlength'
    }
    return true
  }
}
export default Form 