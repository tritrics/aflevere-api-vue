import { has, toBool, toObj } from '../../fnlib'
import base from './Base'
import { createHtmlLink } from './HtmlLink'

export function createLanguage(obj) {
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
    $link: createHtmlLink(obj),
  }
  data.$meta.default = toBool(data.$meta.default)
  if (has(obj, 'terms')) {
    data.$terms = obj.terms
  }
  data.$value = obj.value
  return toObj(base, functions, data)
}