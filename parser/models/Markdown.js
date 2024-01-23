import { extend } from '../../fnlib'
import { createString } from './String.js'

/**
 * Model for API field: markdown
 *
 * @param {object} obj the field data
 * @returns {object}
 */
export function createMarkdown(obj) {
  const field = createString(obj)
  
  const extend = {
    $type: 'markdown',
    $html() {
      return 'mardown converting to html not implemented yet'
    },
  }
  return extend(field, extend)
}