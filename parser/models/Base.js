import { toStr } from '../../fnlib'

/**
 * Base object for all models
 */
const base = {
  $val() {
    return this.$value
  },
  $str() {
    return this.toString(...arguments)
  },
  toString() {
    return toStr(this.$val())
  },
}

export default base