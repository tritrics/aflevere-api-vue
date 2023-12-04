import { has, each, isStr, toObj } from '../../fnlib'
import base from './Base'
import { createLink } from './Link'

export function createPage(obj) {
  const functions = {
    $val() {
      return this.$meta.slug
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
    $type: 'page',
    $meta: obj.meta,
    $link: createLink(obj),
  }
  if (has(obj, 'translations')) {
    data.$translations = {}
    each(obj.translations, (link, lang) => {
      data.$translations[lang] = createLink(link)
    })
  }
  if (has(obj, 'value')) {
    data = { ...data, ...obj.value }
  }
  return toObj(base, functions, data)
}