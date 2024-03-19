import { has, isStr, extend } from '../../fn'
import { createBase, createLink } from './index'

/**
 * Model for API field: site
 *
 * @param {object} obj the field data
 * @returns {object}
 */
export default function createSite(obj) {
  const functions = {
    $val() {
      return this.$meta.host
    },
    $has(prop) {
      return isStr(prop) && has(this, prop)
    },
  }
  
  let data = {
    $type: 'site',
    $meta: obj.meta,
    $home: createLink(obj),
  }
  if (has(obj, 'value')) {
    data = { ...data, ...obj.value }
  }
  return extend(createBase(), functions, data)
}