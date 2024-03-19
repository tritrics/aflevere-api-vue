import { has, each, isStr, extend, toBool } from '../../fn'
import { createBase, createLink } from './index'

/**
 * Model for API field: page
 *
 * @param {object} obj the field data
 * @returns {object}
 */
export default function createPage(obj) {
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
  data.$meta.home = toBool(data.$meta.home)
  if (has(obj, 'translations')) {
    data.$translations = {}
    each(obj.translations, (link, lang) => {
      data.$translations[lang] = createLink(link)
    })
  }
  if (has(obj, 'value')) {
    data = { ...data, ...obj.value }
  }
  return extend(createBase(), functions, data)
}