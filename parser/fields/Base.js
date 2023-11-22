import { toStr } from '../../fnlib'

const base = {
  _val() {
    return this._value
  },
  _str() {
    return this.toString(...arguments)
  },
  toString() {
    return toStr(this._val())
  },
}

export default base