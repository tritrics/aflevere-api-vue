import { extend } from '../../fnlib'
import { createString } from './String.js'
import { getOption } from '../index'

/**
 * Model for API field: text
 *
 * @param {object} obj the field data
 * @returns {object}
 */
export function createText(obj) {
  const field = createString(obj)
  
  const extend = {
    $type: 'text',
    $str(options) {
      return this.toString(options)
    },
    toString(options) {
      let str = this.$val()
      if(getOption('text.nl2br', options)) {
        str = str.replace(/\n/mg, '<br />')
      }
      return str
    },
  }
  return extend(field, extend)
}
