import { extend } from '../../fn'
import { createThumb, createFile } from './index'

/**
 * Model for API field: image
 *
 * @param {object} obj the field data
 * @returns {object}
 */
export default function createImage(obj) {
  const field = createFile(obj)
  
  const ext = {
    $type: 'image',
    $thumb(width = null, height = null, options = {}) {
      return createThumb(obj.meta, ...arguments)
    },
  }
  return extend(field, ext)
}