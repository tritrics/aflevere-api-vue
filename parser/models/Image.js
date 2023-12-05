import { extendObj } from '../../fnlib'
import { createFile } from './File.js'
import { createThumb } from '../../image'

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