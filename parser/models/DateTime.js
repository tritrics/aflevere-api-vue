import { toObj, now, today } from '../../fnlib'
import { getOption } from '../index'
import base from './Base'

export function createDateTime(obj) {
  const functions = {
    $isPast(includeToday = false) {
      return includeToday ? today() >= this.$value : today() > this.$value
    },
    $isFuture(includeToday = false) {
      return includeToday ? today() <= this.$value : today() < this.$value
    }, 
    $isToday() {
      return +today() === +this.$value
    },
    $isOver() {
      return now() > this.$value
    },
    $isComing() {
      return now() <= this.$value
    },
    toString(options) {
      return this.$value.toLocaleString(
        getOption('global.locale', options)
        , { ...getOption('date.format', options), ...getOption('time.format', options) }
      )
    }
  }
  
  const data = {
    $type: 'datetime',
    $value: new Date(Date.UTC(...obj.meta.jsdate.split(','))),
    $timezone: obj.meta.timezone,
  }
  return toObj(base, functions, data)
}
