import { toObj, now } from '../../fnlib'
import { getOption } from '../index'
import base from './Base'

export function createTime(obj) {
  const functions = {
    _isOver() {
      return now(this._value) > this._value
    },
    _isComing() {
      return now(this._value) <= this._value
    },
    toString(options) {
      return this._value.toLocaleTimeString(
        getOption('global.locale', options),
        getOption('time.format', options)
      )
    }
  }

  const data = {
    _type: 'time',
    _value: new Date(Date.UTC(...obj.meta.jsdate.split(','))),
    _timezone: obj.meta.timezone,
  }
  return toObj(base, functions, data)
}
