import { toStr } from '../../fnlib'

/**
 * Base object for all models
 */
export function createBase() {
  return Object.create({ // create instance/copy, important!
    $val() {
      return this.$value
    },
    $str() {
      return this.toString(...arguments)
    },
    toString() {
      return toStr(this.$val())
    },
  })
}