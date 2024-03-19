import { toStr } from '../../fn'

/**
 * Base object for all models
 */
export default function createBase() {
  return Object.create({ // create instance/copy, important!
    $type: 'string',
    $value: '',
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