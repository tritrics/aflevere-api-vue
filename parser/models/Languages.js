import { has, each, isStr, extend } from '../../fnlib'
import { createBase } from './Base'

/**
 * Model for API field: languages
 *
 * @param {object} obj the field data
 * @returns {object}
 */
export function createLanguages(obj) {
  const functions = {
    $has(code) {
      return isStr(code) && has(this.$value, code)
    },
    $get(code) {
      return this.$value[code] || false
    },
    $codes(defaultFirst = true) {
      const first = []
      const codes = []
      each(this.$value, (lang, code) => {
        if (defaultFirst && lang.$isDefault()) {
          first.push(code)
        } else {
          codes.push(code)
        }
      })
      return first.concat(codes.sort())
    },
    $default() {
      let res = false
      each(this.$value, lang => {
        if (lang.$default()) {
          res = lang
        }
      })
      return res
    }
  }
  
  let data = {
    $type: 'languages',
    $value: obj.value,
  }
  return extend(createBase(), functions, data)
}