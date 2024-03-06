import { extend } from '../../fn'
import { createThumb } from './Thumb.js'
import { createFile } from './File.js'



/**
 * Model for API field: image
 *
 * @param {object} obj the field data
 * @returns {object}
 */
export function createImage(obj) {
  const field = createFile(obj)
  
  const ext = {
    $type: 'image',
    $thumb(width = null, height = null, options = {}) {
      return createThumb(obj.meta, ...arguments)
    },
  }
  return extend(field, ext)
}