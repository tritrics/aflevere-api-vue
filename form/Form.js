import { ref, computed } from 'vue'
import { createAction } from '../api'
import { each, has, toKey, camelCase, isBool, isObj, isStr, toBool } from '../fn'
import * as models  from './models'

const Form = class {

  /**
   * The field definitions like given in constructor or from API.
   * Used to reset the form.
   */
  defs = {}

  /**
   * List of field with all properties
   */
  fields = ref({})

  /**
   * Plugin-options
   */
  options = ref({
    action: null,
    lang: null,
    immediate: false,
  })

  /**
   * Validation on input or only after validation() was called.
   */
  onInput = ref(false)

  /**
   * Overall valid flag
   */
  valid = computed(() => {
    let res = true
    each(this.fields.value, (field) => {
      if (!field.valid) {
        res = false
      }
    })
    return res
  })

  /**
   * @param {object} options
   * @param {fields} fields field definitions, otherwise taken from action
   */
  constructor(options, fields) {
    this.setOptions(options)
    if(isObj(fields)) {
      this.defs = fields
    } else if(isStr(this.options.value.action)) {
      this.defs = this.getFieldDefFromApi()
    } else {
      this.defs = {}
    }
    this.initForm()
  }

  /**
   * Setting options
   * 
   * @param {object} options 
   * @return {void}
   */
  setOptions(options) {
    if (isObj(options)) {
      if (has(options, 'action') && isStr(options.action, 1)) {
        this.options.value.action = toKey(options.action)
      }
      if (has(options, 'lang') && isStr(options.lang, 1)) {
        this.options.value.lang = toKey(options.lang)
      }
      if (has(options, 'immediate') && isBool(options.immediate, false)) {
        this.options.value.immediate = toBool(options.immediate)
      }
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
   * Init all fields
   * 
   * @param {object} fields 
   */
  initForm() {
    this.fields.value = {}
    this.onInput.value = this.options.value.immediate
    each(this.defs, (def, key) => {
      const factory = camelCase('create', toKey(def.type))
      if (has(models, factory)) {
        this.fields.value[key] = models[factory](def)
      } else {
        this.fields.value[key] = models.createString(def)
      }
    })
    if (this.onInput.value) {
      each(this.fields.value, (field) => {
        field.watch(true)
      })
    }
  }

  /**
   * Validation of all fields and also switch the immediate setting
   * 
   * @param {boolean} immediate
   * @returns {void}
   */
  validate(onInput) {
    if (isBool(onInput)) {
      this.onInput.value = toBool(onInput)
    }
    each(this.fields.value, (field) => {
      field.validate()
      field.watch(this.onInput.value)
    })
  }

  /**
   * Get values from fields in their native type (number, boolean, string)
   * 
   * @returns {object}
   */
  data() {
    const res = {}
    each(this.fields.value, (field, key) => {
      res[key] = field.data()
    })
    return res
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
    each(this.fields.value, (field) => {
      field.watch(false)
    })
    this.initForm()
  }
}
export default Form 