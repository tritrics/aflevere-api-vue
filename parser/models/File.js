import { has, isStr, extend } from '../../fnlib'
import { createBase } from './Base'
import { createLink } from './Link'

/**
 * Model for API field: file
 *
 * @param {object} obj the field data
 * @returns {object}
 */
export function createFile(obj) {
  const functions = {
    $val() {
      return this.$meta.filename
    },
    $has(prop) {
      return isStr(prop) && has(this, prop)
    },
    $tag(options) {
      return this.$link.$tag(options)
    },
    $attr(asString, options) { // { router: false , attr: { class: 'link-class' } }
      return this.$link.$attr(asString, options)
    },
  }
  
  let data = {
    $type: 'file',
    $meta: obj.meta,
    $link: createLink(obj),
  }
  if (has(obj, 'value')) {
    data = { ...data, ...obj.value }
  }
  return extend(createBase(), functions, data)
}
