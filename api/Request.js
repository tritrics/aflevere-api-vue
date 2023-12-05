import { isObj, toPath, isUrl } from '../fnlib'

class ApiError extends Error {
  constructor(msg, status, url, ...params) {
    super(...params)
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, ApiError)
    }
    this.name = 'ApiError'
    this.msg = msg
    this.status = status
    this.url = url
  }
}

const Request = class {
  Options

  constructor(_Options) {
    this.Options = _Options
  }

  /**
   * Setting single options
   */

  host() {
    this.Options.setHost(...arguments)
    return this
  }

  lang() {
    this.Options.setLang(...arguments)
    return this
  }

  fields() {
    this.Options.setFields(...arguments)
    return this
  }

  all() {
    this.Options.setFields(true)
    return this
  }

  limit() {
    this.Options.setLimit(...arguments)
    return this
  }

  page() {
    this.Options.setPage(...arguments)
    return this
  }

  order() {
    this.Options.setOrder(...arguments)
    return this
  }

  raw() {
    this.Options.setRaw(true)
    return this
  }

  sleep() {
    this.Options.setSleep(...arguments)
    return this
  }

  /**
   * requests
   */

  async info() {
    const url = this.getUrl(
      this.Options.getHost(), 
      this.Options.getVersion(),
      'info'
    )
    const json = await this.apiRequest(url)
    return this.getResult(json)
  }

  async node(node) {
    const url = this.getUrl(
      this.Options.getHost(),
      this.Options.getVersion(),
      'node',
      this.Options.getLang(),
      node
    )
    const data = {
      fields: this.Options.getFields(),
      sleep: this.Options.getSleep(),
    }
    const json = await this.apiRequest(url, data)
    return this.getResult(json)
  }

  async nodes(node) {
    const url = this.getUrl(
      this.Options.getHost(), 
      this.Options.getVersion(),
      'nodes',
      this.Options.getLang(),
      node
    )
    const data = {
      page: this.Options.getPage(),
      limit: this.Options.getLimit(),
      order: this.Options.getOrder(),
      fields: this.Options.getFields(),
      sleep: this.Options.getSleep(),
    }
    const json = await this.apiRequest(url, data)
    return this.getResult(json)
  }

  async call(node, data) {
    const url = this.getUrl(
      this.Options.getHost(),
      this.Options.getVersion(),
      node
    )
    const json = await this.apiRequest(url, data, false) // never parse, raw
    return this.getResult(json)
  }

  /**
   * Helper
   */

  getResult(json) {
    if (this.Options.hasParser() && !this.Options.getRaw()) {
      return this.Options.parser(json)
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
