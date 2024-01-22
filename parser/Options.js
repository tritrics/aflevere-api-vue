import { each, has, clone, merge, isObj, isStr } from '../fnlib'

/**
 * Options for parser plugin
 */
const Options = class {

  /**
   * All available params with default values
   */
  #params = {
    global: {
      locale: { default: undefined, value: null, },
    },
    number: {
      fixed: { default: null, value: null, }
    },
    link: {
      router: { default: false, value: null, },
    },
    html: {
      attr: { default: {}, value: null, },
    },
    text: {
      nl2br: { default: false, value: null, }
    },
    date: {
      // @see: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat/DateTimeFormat#params
      format: { default: { year: 'numeric', month: 'numeric', day: 'numeric', }, value: null, }
    },
    time: {
      // @see: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat/DateTimeFormat#params
      format: { default: { hour: '2-digit', minute: '2-digit', }, value: null, }
    }
  }

  /**
   * 
   * @param {object} params 
   */
  constructor(params = {}) {
    this.set(params, true)
  }

  /**
   * Set option(s)
   * 
   * @param {object} params 
   * @param {boolean} reset replace all existing options instead of merging
   */
  set(params, reset = false) {
    if (reset) {
      this.reset()
    }
    each(params, (props, field) => {
      if (has(this.#params, field)) {
        each(props, (prop, key) => {
          if (has(this.#params[field], key)) {
            if (isObj(prop.default)) {
              this.#params[field][key].value = merge(prop.value, params[field][key])
            } else {
              this.#params[field][key].value = params[field][key]
            }
          }
        })
      }
    })
  }

  /**
   * Set locale (after language change)
   * Accepted: `de-DE` or `de_DE`
   * 
   * @param {string} locale
   * @returns {string}
   */
  setLocale(locale) {
    if (isStr(locale)) {
      if(/^[a-z]{2,}[_]{1,}[A-Z]{2,}$/.test(locale)) {
        locale = locale.replace('_', '-')
      }
      if(/^[a-z]{2,}[-]{1,}[A-Z]{2,}$/.test(locale)) {
        this.set({ global: { locale: locale }})
      }
    }
    return this.#params.global.locale.value
  }

  /**
   * Get a specific option from this.#params and optionally return 
   * the user-given option.
   * 
   * @param {string} path dot-separated path to options like `global.locale`
   * @param {object} params optionally user-given option
   * @returns {mixed}
   */
  get(path, params = {}) {
    const nodes = path.split('.')
    const field = nodes[0]
    const prop = nodes[1]

    // return user option if given and valid
    if (has(params, prop)) {
      if (isObj(this.#params[field][prop].default)) {
        return merge(clone(this.#params[field][prop].value), params[prop])
      }
      return params[prop]
    }
    return this.#params[field][prop].value
  }

  /**
   * Reset all options to their default value.
   */
  reset() {
    each(this.#params, (props, field) => {
      each(props, (prop, key) => {
        prop.value = clone(prop.default)
      })
    })
  }
}

export default Options
