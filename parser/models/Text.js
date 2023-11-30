import { extendObj } from '../../fnlib'
import { createString } from './String.js'
import { getOption } from '../index'

export function createText(obj) {
  const field = createString(obj)
  
  const extend = {
    _type: 'text',
    _str(options) {
      return this.toString(options)
    },
    toString(options) {
      let str = this._val()
      if(getOption('text.nl2br', options)) {
        str = str.replace(/\n/mg, '<br />')
      }
      return str
    },
  }
  return extendObj(field, extend)
}
