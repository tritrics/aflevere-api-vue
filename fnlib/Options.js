import isObj from './isObj'
import each from './each'

/**
 * general option object
 */
const Options = class {
  params

  constructor(params) {
    this.params = isObj(params) ? params : {}
  }

  get(key) {
    return this.params[key] || false
  }

  set(key, val) {
    this.params[key] = val
  }

  merge(params) {
    if (isObj(params)) {
      each(params, (val, key) => {
        this.set(key, val)
      })
    }
  }
}

export default Options