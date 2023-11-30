import { toObj, today } from '../../fnlib'
import { getOption } from '../index'
import base from './Base'

export function createDate(obj) {
  const functions = {
    _isPast(includeToday = false) {
      return includeToday ? today() >= this._value : today() > this._value
    },
    _isFuture(includeToday = false) {
      return includeToday ? today() <= this._value : today() < this._value
    },
    _isToday() {
      return +today() === +this._value
    },
    toString(options) {
      return this._value.toLocaleDateString(
        getOption('global.locale', options),
        getOption('date.format', options)
      )
    }
  }

  const data = {
    _type: 'date',
    _value: new Date(Date.UTC(...obj.meta.jsdate.split(','))),
    _timezone: obj.meta.timezone,
  }
  return toObj(base, functions, data)
}
