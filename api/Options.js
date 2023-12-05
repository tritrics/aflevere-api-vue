import { APIVERSION } from './index.js'
import { each, has, trim, lower, isArr, isBool, isFunc, isInt, isObj, isStr, toBool, upperFirst } from '../fnlib'

const OptionsWrapper = class {
  #params = {
    host: null,
    lang:  null,
    fields: 'all',
    limit: 10,
    page: 1,
    order: 'asc',
    raw: false,
    sleep: 0,
  }

  constructor(params = {}) {
    this.set(params)
  }

  clone(params, reset = false) {
    const clone = new OptionsWrapper()
    if (!reset) {
      clone.set(structuredClone(this.#params))
    }
    clone.set(params)
    clone.parser = this.parser
    clone.i18n = this.i18n
    return clone
  }

  /**
   * Getter
   */

  getVersion() {
    return APIVERSION
  }

  getHost() {
    return this.#params.host
  }

  getLang() {
    return this.#params.lang
  }

  getFields() {
    return this.#params.fields
  }

  getLimit() {
    return this.#params.limit
  }

  getPage() {
    return this.#params.page
  }

  getOrder() {
    return this.#params.order
  }

  getRaw() {
    return this.#params.raw
  }

  getSleep() {
    return this.#params.sleep
  }

  /**
   * Setter
   */
  set(_options) {
    if (!isObj(_options)) {
      return
    }
    each(this.#params, (val, prop) => {
      if (has(_options, prop)) {
        const setter = `set${upperFirst(prop)}`
        this[setter](_options[prop])
      }
    })
  }

  setHost(val) {
    if (isStr(val) && val.startsWith('http')) {
      let host = this.normalize(val)
      if (host.endsWith('/')) {
        host = host.substring(0, host.length - 1)
      }
      this.#params.host = host
    }
  }

  setLang(val) {
    if (isStr(val)) {
      this.#params.lang = this.normalize(val)
    } else {
      this.#params.lang = null
    }
  }

  setFields(...val) {
    let fields = []
    if (val.length === 1) {
      if (toBool(val[0]) === true) {
        this.#params.fields = 'all'
        return
      } else if (isArr(val[0])) {
        fields = val[0]
      } else if (isStr(val[0])) {
        fields = val[0].split(',')
      }
    } else {
      fields = val
    }
    fields = fields.filter((field) => isStr(field, 1))
    this.#params.fields = fields.map((field) => lower(field))
  }

  setLimit(val) {
    if (isInt(val, 1)) {
      this.#params.limit = val
    }
  }

  setPage(val) {
    if (isInt(val, 1)) {
      this.#params.page = val
    }
  }

  setOrder(val) {
    if (isStr(val)) {
      const order = this.normalize(val)
      if (order === 'asc' || order === 'desc') {
        this.#params.order = order
      }
    }
  }

  setRaw(val) {
    this.#params.raw = isBool(val) ? val : false
  }

  setSleep(val) {
    if (isInt(val, 0, 10)) {
      this.#params.sleep = val
    } else {
      this.#params.sleep = 1
    }
  }

  /**
   * Plugin: parser
   */
  parser = null // contains parse function

  setParser(parser) {
    if(isFunc(parser)) {
      this.parser = parser
    }
  }

  hasParser() {
    return isFunc(this.parser)
  }

  /**
   * Helper
   */
  normalize(val) {
    return trim(lower(val))
  }
}

export default OptionsWrapper
