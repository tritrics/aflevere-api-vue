import { isObj, toPath, isUrl } from '../fnlib'
import Options from './Options'
import ApiError from './ApiError'

const Request = class {
  options

  /**
   * @param {Options} _options, mandatory
   */
  constructor(_options) {
    this.options = _options
  }

  /**
   * Setting single options
   */

  host() {
    this.options.setHost(...arguments)
    return this
  }

  lang() {
    this.options.setLang(...arguments)
    return this
  }

  fields() {
    this.options.setFields(...arguments)
    return this
  }

  all() {
    this.options.setFields(true)
    return this
  }

  limit() {
    this.options.setLimit(...arguments)
    return this
  }

  page() {
    this.options.setPage(...arguments)
    return this
  }

  order() {
    this.options.setOrder(...arguments)
    return this
  }

  raw() {
    this.options.setRaw(true)
    return this
  }

  sleep() {
    this.options.setSleep(...arguments)
    return this
  }

  /**
   * requests
   */

  async info() {
    const url = this.getUrl(
      this.options.host, 
      this.options.version,
      'info'
    )
    const data = this.options.sleep > 0 ? { sleep: this.options.sleep } : null
    const json = await this.apiRequest(url, data)
    return this.getResult(json)
  }

  async node(node) {
    const url = this.getUrl(
      this.options.host,
      this.options.version,
      'node',
      this.options.lang(),
      node
    )
    const data = {
      fields: this.options.fields,
      sleep: this.options.sleep,
    }
    const json = await this.apiRequest(url, data)
    return this.getResult(json)
  }

  async nodes(node) {
    const url = this.getUrl(
      this.options.host, 
      this.options.version,
      'nodes',
      this.options.lang(),
      node
    )
    const data = {
      page: this.options.page,
      limit: this.options.limit,
      order: this.options.order,
      fields: this.options.fields,
      sleep: this.options.sleep,
    }
    const json = await this.apiRequest(url, data)
    return this.getResult(json)
  }

  async call(node, data) {
    const url = this.getUrl(
      this.options.host,
      this.options.version,
      node
    )
    const json = await this.apiRequest(url, data, false) // never parse, raw
    return this.getResult(json)
  }

  /**
   * Helper
   */

  getResult(json) {
    if (this.options.parser && !this.options.raw) {
      return this.options.parser(json)
    }
    return json
  }

  getUrl(...args) {
    const res = toPath(...args)
    if (!isUrl(res)) {
      throw new Error('No host defined for Api request')
    }
    return res
  }

  async apiRequest(url, data) {
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
        throw new ApiError(`API reports an error: ${msg}`, status, url)
      }
      return json
    } catch (E) {
      if (E instanceof ApiError) throw E
      throw new ApiError(E.message ?? 'Unknown fatal error', E.cause ?? 500, url)
    }
  }
}

export default Request
