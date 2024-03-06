import { isObj, toPath, isUrl, upper, objToParam } from '../fn'
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
   * Shortcut for fields(true)
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
    return await this.apiRequest(url, 'GET', data)
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
    return await this.apiRequest(url, 'GET', data)
  }

  /**
   * Post data to a specified action /action/(:any).
   * 
   * @param {string} action 
   * @returns {object} data
   */
  async create(action, data) {
    this.Options.setRaw(true)

    // get token
    const urlToken = this.getUrl(
      this.Options.getHost(), 
      this.Options.getVersion(),
      'token',
      this.Options.getLang(),
      action
    )
    const res = await this.apiRequest(urlToken)

    // submit
    const urlSubmit = this.getUrl(
      this.Options.getHost(), 
      this.Options.getVersion(),
      'action',
      this.Options.getLang(),
      action,
      res.body.token
    )
    return await this.apiRequest(urlSubmit, 'POST', data)
  }

  /**
   * Generic API-request
   * 
   * @param {string} path
   * @param {object} data post-data
   * @returns {object} json
   */
  async call(path, method = 'GET', data = null) {
    const url = this.getUrl(
      this.Options.getHost(),
      this.Options.getVersion(),
      path
    )
    return await this.apiRequest(url, method, data)
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
   * @param {string} method GET, POST, PUT, DELETE
   * @param {object} data optional data, converts to post data or get-params
   * @returns {object} json, parsed if parser-plugin is installed
   * @throws Error
   */
  async apiRequest(url, method = 'GET', data = null) {
    const options = {
      method: upper(method),
      mode: 'cors',
      cache:'no-cache',
    }
    if (isObj(data)) {
      if (method === 'GET') {
        url = `${url}${objToParam(data)}`
        console.log(url)
      } else {
        options.headers = { 'content-type': 'application/json' }
        options.body = JSON.stringify(data)
      }
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
