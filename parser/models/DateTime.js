import { toObj, now, today } from '../../fnlib'
import { getOption } from '../index'
import base from './Base'

export function createDateTime(obj) {
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
    _isOver() {
      return now() > this._value
    },
    _isComing() {
      return now() <= this._value
    },
    toString(options) {
      return this._value.toLocaleString(
        getOption('global.locale', options)
        , { ...getOption('date.format', options), ...getOption('time.format', options) }
      )
    }
  }
  
  const data = {
    _type: 'datetime',
    _value: new Date(Date.UTC(...obj.meta.jsdate.split(','))),
    _timezone: obj.meta.timezone,
  }
  return toObj(base, functions, data)
}
