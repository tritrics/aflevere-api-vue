import { has, toBool, isStr, toObj } from '../../fnlib'
import base from './Base'

/**
 * Model for API field: info
 *
 * @param {object} obj the field data
 * @returns {object}
 */
export function createInfo(obj) {
  const functions = {
    $val() {
      return this.$meta.slug
    },
    $has(prop) {
      return isStr(prop) && has(this, prop)
    },
    $multilang() {
      return this.$meta.multilang
    },
    $languages() {
      return has(this.$meta, 'languages') ? this.$meta.languages : 0
    },
  }

  let data = {
    $type: 'info',
    $meta: obj.meta,
  }
  data.$meta.multilang = toBool(data.$meta.multilang)
  if (has(obj, 'interface')) {
    data.$interface = obj.interface
  }
  if (has(obj, 'value')) {
    data = { ...data, ...obj.value }
  }
  return toObj(base, functions, data)
}