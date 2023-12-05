import { has, each, isStr, toObj, toBool } from '../../fnlib'
import base from './Base'
import { createHtmlLink } from './HtmlLink'

export function createNode(obj) {
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
    $type: 'node',
    $meta: obj.meta,
    $link: createHtmlLink(obj),
  }
  data.$meta.home = toBool(data.$meta.home)
  if (has(obj, 'translations')) {
    data.$translations = {}
    each(obj.translations, (link, lang) => {
      data.$translations[lang] = createHtmlLink(link)
    })
  }
  if (has(obj, 'value')) {
    data = { ...data, ...obj.value }
  }
  return toObj(base, functions, data)
}