import { each, has, clone, merge, isObj, isStr } from '../fnlib'

const OptionsWrapper = class {
  #params = {
    global: {
      locale: {
        default: undefined,
        value: null,
      },
    },
    number: {
      fixed: {
        default: null,
        value: null,
      }
    },
    link: {
      router: {
        default: false,
        value: null,
      },
    },
    html: {
      attr: {
        default: {},
        value: null,
      },
    },
    text: {
      nl2br: {
        default: false,
        value: null,
      }
    },
    date: {
      // @see: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat/DateTimeFormat#params
      format: {
        default: { year: 'numeric', month: 'numeric', day: 'numeric', },
        value: null,
      }
    },
    time: {
      // @see: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat/DateTimeFormat#params
      format: {
        default: { hour: '2-digit', minute: '2-digit', },
        value: null,
      }
    }
  }

  constructor(params = {}) {
    this.set(params, true)
  }

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

  setLocale(locale) {
    if(isStr(locale) && /^[a-z]{2,}[-]{1,}[A-Z]{2,}$/.test(locale)) {
      this.set({ global: { locale: locale }})
    }
  }

  /**
   * get a specific option (prop) for a field from parserOptions
   * optionally return the user-given option
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

  reset() {
    each(this.#params, (props, field) => {
      each(props, (prop, key) => {
        prop.value = clone(prop.default)
      })
    })
  }
}

export default OptionsWrapper
