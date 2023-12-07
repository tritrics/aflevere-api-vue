import { extendObj } from '../../fnlib'
import { createThumb } from '../../api'
import { createFile } from './File.js'

export function createImage(obj) {
  const field = createFile(obj)
  
  const extend = {
    $type: 'image',
    $thumb(width = null, height = null, options = {}) {
      return createThumb(this, ...arguments)
    },
  }
  return extendObj(field, extend)
}