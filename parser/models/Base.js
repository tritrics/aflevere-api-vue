import { toStr } from '../../fnlib'

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