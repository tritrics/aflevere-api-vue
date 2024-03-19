import { has, toBool, extend } from '../../fn'
import { createBase, createLink } from './index'

/**
 * Model for API field: language
 *
 * @param {object} obj the field data
 * @returns {object}
 */
export default function createLanguage(obj) {
  const functions = {
    $isDefault() {
      return this.$meta.default
    },
    $code() {
      return this.$meta.code
    },
    $locale() {
      return this.$meta.locale
    },
    $direction() {
      return this.$meta.direction
    },
    $tag(options) {
      return this.$link.$tag(options)
    },
    $attr(asString, options) { // { router: false , attr: { class: 'link-class' } }
      return this.$link.$attr(asString, options)
    },
  }
  
  let data = {
    $type: 'language',
    $meta: obj.meta,
    $link: createLink(obj),
  }
  data.$meta.default = toBool(data.$meta.default)
  if (has(obj, 'terms')) {
    data.$terms = obj.terms
  }
  data.$value = obj.value
  return extend(createBase(), functions, data)
}