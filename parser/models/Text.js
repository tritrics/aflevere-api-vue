import { extend } from '../../fn'
import { getOption } from '../index'
import { createString } from './index'

/**
 * Model for API field: text
 *
 * @param {object} obj the field data
 * @returns {object}
 */
export default function createText(obj) {
  const field = createString(obj)
  
  const ext = {
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
  return extend(field, ext)
}
