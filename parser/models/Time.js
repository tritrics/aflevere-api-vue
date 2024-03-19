import { extend, now } from '../../fn'
import { getOption } from '../index'
import { createBase } from './index'

/**
 * Model for API field: time
 *
 * @param {object} obj the field data
 * @returns {object}
 */
export default function createTime(obj) {
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
    $value: new Date(obj.meta.iso),
    $timezone: obj.meta.timezone,
  }
  return extend(createBase(), functions, data)
}
