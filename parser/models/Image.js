import { extend } from '../../fnlib'
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
  
  const extend = {
    $type: 'image',
    $thumb(width = null, height = null, options = {}) {
      return createThumb(obj.meta, ...arguments)
    },
  }
  return extend(field, extend)
}