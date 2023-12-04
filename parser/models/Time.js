import { toObj, now } from '../../fnlib'
import { getOption } from '../index'
import base from './Base'

export function createTime(obj) {
  const functions = {
    $isOver() {
      return now(this.$value) > this.$value
    },
    $isComing() {
      return now(this.$value) <= this.$value
    },
    toString(options) {
      return this.$value.toLocaleTimeString(
        getOption('global.locale', options),
        getOption('time.format', options)
      )
    }
  }

  const data = {
    $type: 'time',
    $value: new Date(Date.UTC(...obj.meta.jsdate.split(','))),
    $timezone: obj.meta.timezone,
  }
  return toObj(base, functions, data)
}
