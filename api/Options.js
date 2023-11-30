import { each, has, trim, lower, isArr, isBool, isFunc, isInt, isObj, isStr, toStr, toBool } from '../fnlib'

const Options = class {
  host = null

  version = 'v1'

  lang = () => null

  fields = 'all'

  limit = 10

  page = 1

  order = 'asc'

  raw = false

  sleep = 0

  parser = false

  props = ['host', 'lang', 'fields', 'limit', 'page', 'order', 'raw', 'sleep', 'parser']

  constructor(_options = {}) {
    this.set(_options)
  }

  clone(_options) {
    const clone = new Options()
    each(this.props, (prop) => {
      clone[prop] = this[prop]
    })
    clone.set(_options)
    return clone
  }

  set(_options) {
    if (!isObj(_options)) return
    each(this.props, (prop) => {
      if (has(_options, prop)) {
        const setter = `set${prop.charAt(0).toUpperCase()}${prop.slice(1)}`
        this[setter](_options[prop])
      }
    })

    each(_options, (val, key) => {
      const prop = toStr(key).toLowerCase()
      if (has(this.setter, prop)) {
        this.setter[prop](val)
      }
    })
  }

  setHost(val) {
    if (isStr(val) && val.startsWith('http')) {
      let host = this.normalize(val)
      if (host.endsWith('/')) {
        host = host.substring(0, host.length - 1)
      }
      this.host = host
    }
  }

  setVersion(val) {
    if (isStr(val)) {
      this.version = this.normalize(val)
    }
  }

  setLang(val) {
    if (isFunc(val)) {
      this.lang = val
    } else if (isStr(val)) {
      this.lang = () => this.normalize(val)
    } else if (val === null) {
      this.lang = () => null
    }
  }

  setFields(...val) {
    let fields = []
    if (val.length === 1) {
      if (toBool(val[0]) === true) {
        this.fields = 'all'
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
    this.fields = fields.map((field) => lower(field))
  }

  setLimit(val) {
    if (isInt(val, 1)) {
      this.limit = val
    }
  }

  setPage(val) {
    if (isInt(val, 1)) {
      this.page = val
    }
  }

  setOrder(val) {
    if (isStr(val)) {
      const order = this.normalize(val)
      if (order === 'asc' || order === 'desc') {
        this.order = order
      }
    }
  }

  setRaw(val) {
    this.raw = isBool(val) ? val : false
  }

  setSleep(val) {
    if (isInt(val, 1, 10)) {
      this.sleep = val
    } else {
      this.sleep = 1
    }
  }

  setParser(parser) {
    if(isFunc(parser)) {
      this.parser = parser
    }
  }

  normalize(val) {
    return trim(lower(val))
  }
}

export default Options
