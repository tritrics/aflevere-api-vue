import { APIVERSION } from './index'
import { each, has, toKey, lower, isArr, isBool, isInt, isObj, isStr, toBool, upperFirst } from '../fn'

/**
 * Options for an API request
 */
const Options = class {

  /**
   * Default options
   */
  #params = {
    host: null,
    lang:  null,
    fields: [],
    limit: 10,
    page: 1,
    order: 'asc',
    raw: false,
    multilang: true, // multilang is only set to false by i18n-plugin
  }

  /**
   * @param {object} params 
   */
  constructor(params = {}) {
    this.set(params)
  }

  /**
   * Create a new Options instance and merge optionally given params.
   * 
   * @param {object} params 
   * @param {boolean} reset 
   * @returns 
   */
  clone(params, reset = false) {
    const clone = new Options()
    if (!reset) {
      clone.set(structuredClone(this.#params))
    }
    clone.set(params)
    return clone
  }

  /**
   * @returns {string}
   */
  getVersion() {
    return APIVERSION
  }

  /**
   * @returns {string}
   */
  getHost() {
    return this.#params.host
  }

  /**
   * Get the language an optionally overwrite with prefered language.
   * 
   * @param {string} lang prefered language
   * @returns {string}
   */
  getLang(lang = null) {
    if (!this.#params.multilang) {
      return null
    }
    return isStr(lang, 1) ? lang : this.#params.lang
  }

  /**
   * @returns {string|array} can be an array of fields or `all`
   */
  getFields() {
    return this.#params.fields
  }

  /**
   * @returns {integer}
   */
  getLimit() {
    return this.#params.limit
  }

  /**
   * @returns {integer}
   */
  getPage() {
    return this.#params.page
  }

  /**
   * @returns {string}
   */
  getOrder() {
    return this.#params.order
  }

  /**
   * @returns {boolean}
   */
  getRaw() {
    return this.#params.raw
  }

  /**
   * Set multiple options at once
   * 
   * @param {object} options
   */
  set(options) {
    if (!isObj(options)) {
      return
    }
    each(this.#params, (val, prop) => {
      if (has(options, prop)) {
        const setter = `set${upperFirst(prop)}`
        this[setter](options[prop])
      }
    })
  }

  /**
   * Set option `host`
   * Parameter is the fully qualified hostname followed by the api-slug
   * like set in Kirby's config.
   * 
   * @param {string} host 
   */
  setHost(host) {
    if (isStr(host) && host.startsWith('http')) {
      host = this.normalize(host)
      if (host.endsWith('/')) {
        host = host.substring(0, host.length - 1)
      }
      this.#params.host = host
    }
  }

  /**
   * Set option `lang`
   * Parameter must be a valid 2-char language code.
   * 
   * @param {string} lang 
   */
  setLang(lang) {
    if (isStr(lang)) {
      this.#params.lang = this.normalize(lang)
    } else {
      this.#params.lang = null
    }
  }

  /**
   * Set option `fields`
   * given parameter can be:
   *   - setFields(true) to request all fields
   *   - array with list of fieldnames setFields(['field1', 'field2', 'field3'])
   *   - string with comma-separated fieldnames setFields('field1, field2, field3')
   *   - multiple strings with fieldnames setFields('field1', 'field2', 'field3')
   * 
   * @param {array} val
   */
  setFields(...val) {
    let fields = []
    if (val.length === 1) {
      if (toBool(val[0]) === true || val[0] === 'all') {
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

  /**
   * Set option `limit`
   * Used in API request pages() to limit the number of returned pages.
   * 
   * @param {integer} limit positive value, default 10
   */
  setLimit(limit) {
    if (isInt(limit, 1)) {
      this.#params.limit = limit
    }
  }

  /**
   * Set option `page`
   * Used in API request pages() to get a specified result set in combination with limit.
   * 
   * @param {integer} pageno positive value, default 1
   */
  setPage(pageno) {
    if (isInt(pageno, 1)) {
      this.#params.page = pageno
    }
  }

  /**
   * Set option `order`
   * Used in API request pages() sort the returned pages ascending or descending.
   * 
   * @param {string} order [ asc | desc ]
   */
  setOrder(order) {
    if (isStr(order)) {
      order = this.normalize(order)
      if (order === 'asc' || order === 'desc') {
        this.#params.order = order
      }
    }
  }

  /**
   * Set option `raw`
   * Override parser-plugin if existing for this request.
   * 
   * @param {boolean} returnRaw 
   */
  setRaw(raw) {
    this.#params.raw = isBool(raw) ? raw : false
  }

  /**
   * Set option `multilang`
   * In multilang-sites the lang-code is added to the request url.
   * 
   * @param {boolean} isMultilang 
   */
  setMultilang(isMultilang) {
    this.#params.multilang = toBool(isMultilang)
  }

  /**
   * @param {string} val 
   * @returns {string}
   */
  normalize(val) {
    return toKey(val)
  }
}

export default Options
