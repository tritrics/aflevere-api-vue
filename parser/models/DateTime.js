import { extend, now, today } from '../../fn'
import { getOption } from '../index'
import { createBase } from './Base'

/**
 * Model for API field: datetime
 *
 * @param {object} obj the field data
 * @returns {object}
 */
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
    $value: new Date(obj.meta.utc)
  }
  return extend(createBase(), functions, data)
}
