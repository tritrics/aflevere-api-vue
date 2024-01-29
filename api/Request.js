import { isStr, isObj, toPath, isUrl } from '../fnlib'
import { parse } from './index'

/**
 * Class to handle a single request
 */
const Request = class {

  /**
   * Instance of Options
   */
  Options

  /**
   * @param {Options} Options 
   */
  constructor(Options) {
    this.Options = Options
  }

  /**
   * Chaining function to set `host`
   * 
   * @returns {this}
   * @see Options
   */
  host(host) {
    this.Options.setHost(host)
    return this
  }

  /**
   * Chaining function to set `language`
   * 
   * @returns {this}
   * @see Options
   */
  lang(code) {
    this.Options.setLang(code)
    return this
  }

  /**
   * Chaining function to set `fields`
   * 
   * @returns {this}
   * @see Options
   */
  fields() {
    this.Options.setFields(...arguments)
    return this
  }

  /**
   * Chaining function to set `fields` to `all`
   * 
   * @returns {this}
   * @see Options
   */
  all() {
    this.Options.setFields(true)
    return this
  }

  /**
   * Chaining function to set `limit`
   * 
   * @returns {this}
   * @see Options
   */
  limit(limit) {
    this.Options.setLimit(limit)
    return this
  }

  /**
   * Chaining function to set `page`
   * 
   * @returns {this}
   * @see Options
   */
  page(pageno) {
    this.Options.setPage(pageno)
    return this
  }

  /**
   * Chaining function to set `order`
   * 
   * @returns {this}
   * @see Options
   */
  order(order) {
    this.Options.setOrder(order)
    return this
  }

  /**
   * Chaining function to set `raw` to true
   * 
   * @returns {this}
   * @see Options
   */
  raw() {
    this.Options.setRaw(true)
    return this
  }

  /**
   * Call API interface /info.
   * 
   * @returns {object} json
   */
  async info() {
    const url = this.getUrl(
      this.Options.getHost(), 
      this.Options.getVersion(),
      'info'
    )
    return await this.apiRequest(url)
  }

  /**
   * Call API interface /language/(:any).
   * 
   * @param {string} lang 
   * @returns {object} json
   */
  async language(lang) {
    const url = this.getUrl(
      this.Options.getHost(),
      this.Options.getVersion(),
      'language',
      this.Options.getLang(lang)
    )
    return await this.apiRequest(url)
  }

  /**
   * Call API interface /page/(:all?).
   * 
   * @param {string} path the path to the page
   * @returns {object} json
   */
  async page(path) {
    const url = this.getUrl(
      this.Options.getHost(),
      this.Options.getVersion(),
      'page',
      this.Options.getLang(),
      path
    )
    const data = {
      fields: this.Options.getFields(),
    }
    return await this.apiRequest(url, data)
  }

  /**
   * Call API interface /pages/(:all?).
   * 
   * @param {*} path the path to the parent page
   * @returns {object} json
   */
  async pages(path) {
    const url = this.getUrl(
      this.Options.getHost(), 
      this.Options.getVersion(),
      'pages',
      this.Options.getLang(),
      path
    )
    const data = {
      page: this.Options.getPage(),
      limit: this.Options.getLimit(),
      order: this.Options.getOrder(),
      fields: this.Options.getFields(),
    }
    return await this.apiRequest(url, data)
  }

  /**
   * Post data to a specified action /action/submit/(:any).
   * 
   * @param {string} action 
   * @returns {object} data
   */
  async submit(action, data) {

    // store raw settings
    const raw = this.Options.getRaw()

    // get token
    this.Options.setRaw(true)
    const urlToken = this.getUrl(
      this.Options.getHost(), 
      this.Options.getVersion(),
      'action/token',
      this.Options.getLang(),
      action
    )
    const res = await this.apiRequest(urlToken)

    // submit
    this.Options.setRaw(raw)
    const urlSubmit = this.getUrl(
      this.Options.getHost(), 
      this.Options.getVersion(),
      'action/submit',
      this.Options.getLang(),
      action,
      res.body.token
    )
    return await this.apiRequest(urlSubmit, data)
  }

  /**
   * Generic API-request
   * 
   * @param {string} path
   * @param {object} data post-data
   * @returns {object} json
   */
  async call(path, data) {
    const url = this.getUrl(
      this.Options.getHost(),
      this.Options.getVersion(),
      path
    )
    return await this.apiRequest(url, data, false) // never parse, raw
  }

  /**
   * Helper to build an URL from multiple parts.
   * 
   * @param  {...string} args the url parts
   * @returns {string}
   * @throws Error
   */
  getUrl(...args) {
    const res = toPath(...args)
    if (!isUrl(res)) {
      throw new Error('No host defined for Api request')
    }
    return res
  }

  /**
   * Send API request and receive response.
   * 
   * @param {string} url 
   * @param {object} data optional post data
   * @returns {object} json, parsed if parser-plugin is installed
   * @throws Error
   */
  async apiRequest(url, data = null) {
    const options = {}
    if (isObj(data)) {
      options.method = 'POST'
      options.mode = 'cors'
      options.cache = 'no-cache'
      options.headers = { 'content-type': 'application/json' }
      options.body = JSON.stringify(data)
    } else {
      options.method = 'GET'
      options.mode = 'cors'
      options.cache = 'no-cache'
    }
    try {
      const response = await fetch(url, options)
      let json = await response.json()
      if (!response.ok || !json.ok) {
        const msg = json.msg || response.status
        const status = json.status || response.statusText
        throw new Error(`API reports an error while requesting ${url}: ${msg} (Error ${status})`)
      }
      return this.Options.getRaw() ? json : parse(json) // parse does nothing, if no parser loaded
    } catch (E) {
      throw E
    }
  }
}

export default Request
