import { extend, today } from '../../fnlib'
import { getOption } from '../index'
import { createBase } from './Base'

/**
 * Model for API field: date
 *
 * @param {object} obj the field data
 * @returns {object}
 */
export function createDate(obj) {
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
    toString(options) {
      return this.$value.toLocaleDateString(
        getOption('global.locale', options),
        getOption('date.format', options)
      )
    }
  }

  const data = {
    $type: 'date',
    $value: new Date(Date.UTC(...obj.meta.jsdate.split(','))),
    $timezone: obj.meta.timezone,
  }
  return extend(createBase(), functions, data)
}
