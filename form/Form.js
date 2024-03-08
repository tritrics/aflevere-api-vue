import { ref, computed, watchEffect } from 'vue'
import { createAction } from '../api'
import { each, has, lower, trim, camelCase, isStr, isEmpty, isEmail, isUrl, isObj, isArr, inArr, isInt, isTrue, isNum, isBool, toNum, toStr, toBool } from '../fn'

const Form = class {

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
  options = {}

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
    if (isObj(options)) {
      this.options = options
    }
    if (isStr(mixed, 1)) {
      this.action = mixed
      this.defs = this.getFieldDefFromApi()
    } else if(isObj(mixed)) {
      this.defs = mixed
    }
    this.initFields()
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
    if (has(this.options, 'action') && isStr(this.options.action, 1)) {
      const options = {}
      if (has(this.options, 'lang') && isStr(this.options.lang, 1)) {
        options.lang = this.options.lang
      }
      return await createAction(this.options.action, this.data(), options)
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
      this.initField(key, def)
    })
  }

  /**
   * Init a single field
   * 
   * @param {string} key the field name
   * @param {object} def the field properties
   */
  initField(key, def) {
    const res = {}

    // Type
    res.type = 'string'
    if (has(def, 'type')) {
      const type = lower(trim(def.type))
      if (inArr(type, [ 'boolean', 'email', 'number', 'select', 'string', 'text', 'url' ])) {
        res.type = type
      }
    }

    // multiple, min, max
    if (inArr(res.type, ['string', 'select'])) {
      res.multiple = has(def, 'multiple') && isTrue(def.multiple)
      if (res.multiple) {
        res.min = has(def, 'min') && isInt(def.min, 1) ? def.min : null
        res.max = has(def, 'max') && isInt(def.max, 1) ? def.max : null
      }
    }

    // Preset value
    // boolean is converted to bool, because checkbox v-model requires bool
    // all other values are converted to strings
    if(res.type === 'boolean') {
      res.value = has(def, 'value') && isTrue(def.value, false) ? true : false
    } else if(res.type === 'string' && res.multiple) {
      let value = isArr(def.value) ? def.value : []
      if (isInt(res.min, 1) && value.length < res.min) {
        res.value = value.concat(Array.from({length: res.min - value.length}, n => ''))
      } else if (isInt(res.max, 1) && value.length > res.max) {
        res.value = value.slice(0, res.max)
      } else {
        res.value = value
      }
    } else if(res.type === 'select' && res.multiple) {
      res.value = has(def, 'value') && isArr(def.value) ? def.value : []
    } else {
      res.value = has(def, 'value') ? toStr(def.value) : ''
    }

    // Options
    if(res.type === 'select') {
      res.options = has(def, 'options') && isArr(def.options) ? def.options : []
    }

    // required
    res.required = has(def, 'required') && isTrue(def.required) ? true : false

    // minlength, maxlength
    if (inArr(res.type, ['string', 'text'])) {
      res.minlength = has(def, 'minlength') && isInt(def.minlength, 1) ? def.minlength : null
      res.maxlength = has(def, 'maxlength') && isInt(def.maxlength, 1) ? def.maxlength : null
    }

    // minvalue, maxvalue
    if(res.type === 'number') {
      res.minvalue = has(def, 'minvalue') && isInt(def.minvalue, 1) ? def.minvalue : null
      res.maxvalue = has(def, 'maxvalue') && isInt(def.maxvalue, 1) ? def.maxvalue : null
    }

    // error/validation flags
    res.valid = true
    res.error = computed(() => !this.fields.value[key].valid && !this.showErrors.value)
    res.msg = ''

    // set before watcher is added
    this.fields.value[key] = res

    // watcher
    this.fields.value[key].stop = watchEffect(() => {
      this.validateField(
        key,
        this.fields.value[key].value // important to kick off the watchEffect
      )
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
      return isNum(def.value, def.minvalue, def.maxvalue, false)
    }
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