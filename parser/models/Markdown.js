import { extendObj } from '../../fnlib'
import { createString } from './String.js'

export function createMarkdown(obj) {
  const field = createString(obj)
  
  const extend = {
    $type: 'markdown',
    $html() {
      return 'mardown converting to html not implemented yet'
    },
  }
  return extendObj(field, extend)
}