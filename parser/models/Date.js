import { extend, today } from '../../fn'
import { getOption } from '../index'
import { createBase } from './index'

/**
 * Model for API field: date
 *
 * @param {object} obj the field data
 * @returns {object}
 */
export default function createDate(obj) {
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
    $value: new Date(obj.meta.utc)
  }
  return extend(createBase(), functions, data)
}
