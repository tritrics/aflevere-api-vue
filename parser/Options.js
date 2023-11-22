import { each, has, clone, merge, isObj } from '../fnlib'

const Options = class {
  props = {
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
      // @see: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat/DateTimeFormat#options
      format: {
        default: { year: 'numeric', month: 'numeric', day: 'numeric', },
        value: null,
      }
    },
    time: {
      // @see: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat/DateTimeFormat#options
      format: {
        default: { hour: '2-digit', minute: '2-digit', },
        value: null,
      }
    }
  }

  constructor(_options = {}) {
    this.set(_options, true)
  }

  set(_options, reset = false) {
    each(this.props, (fieldDef, field) => {
      each(fieldDef, (def, prop) => {
        if (reset) {
          def.value = clone(def.default)
        }
        if(has(_options, field) && has(_options[field], prop)) {
          if (isObj(def.default)) {
            merge(def.value, _options[field][prop])
          }
          def.value = _options[field][prop]
        }
      })
    })
  }

  /**
   * get a specific option (prop) for a field from parserOptions
   * optionally return the user-given option
   */
  get(path, _options = {}) {
    const nodes = path.split('.')
    const field = nodes[0]
    const prop = nodes[1]

    // return user option if given and valid
    if (has(_options, prop)) {
      if (isObj(this.props[field][prop].default)) {
        return merge(clone(this.props[field][prop].value), _options[prop])
      }
      return _options[prop]
    }
    return this.props[field][prop].value
  }
}

export default Options
