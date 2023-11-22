import { extendObj } from '../../fnlib'
import { createFile } from './File.js'
import { createThumb } from '../../images'

export function createImage(obj) {
  const field = createFile(obj)
  
  const extend = {
    _type: 'image',
    _thumb(width = null, height = null, options = {}) {
      return createThumb(this, ...arguments)
    },
  }
  return extendObj(field, extend)
}