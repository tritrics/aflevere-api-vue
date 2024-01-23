import { isObj, isStr, each } from '../index'

/**
 * Simple option object
 */
const Options = class {

  /**
   * The options like { key: value }
   * {object}
   */
  params

  /**
   * @param {object} params 
   */
  constructor(params = {}) {
    this.set(params)
  }

  /**
   * Getter
   * 
   * @param {string} key 
   * @returns {mixed}
   */
  get(key) {
    return this.params[key]
  }

  /**
   * Setter
   * Can also set multiple options at once
   * 
   * @param {string|object} mixed key to set or an object { key: value }
   * @param {mixed} val 
   */
  set(mixed, val = null) {
    if (isObj(mixed)) {
      each(mixed, (val, key) => {
        this.params[key] = val
      })
    } else if (isStr(mixed)) {
      this.params[mixed] = val
    }
  }
}

export default Options