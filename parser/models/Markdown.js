import { extend } from '../../fn'
import { createString } from './index'

/**
 * Model for API field: markdown
 *
 * @param {object} obj the field data
 * @returns {object}
 */
export default function createMarkdown(obj) {
  const field = createString(obj)
  
  const ext = {
    $type: 'markdown',
    $html() {
      return 'mardown converting to html not implemented yet'
    },
  }
  return extend(field, ext)
}