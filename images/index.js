import { has } from '../fn'
import Thumb from './Thumb'

/**
 * Create a Thumb instance with handy image resizing and handling methods.
 * 
 * @param {object} image the image object/node from response
 * @param {integer} width the thumb width in px
 * @param {integer} height the thumb height in px
 * @param {object} options the thumb's options
 * @returns {Thumb}
 */
export function createThumb(image, width = null, height = null, options = {}) {
  let meta = {}
  if (has(image, '$meta')) { // parser object given
    meta = image.$meta
  } else if (has(image, 'meta')) { // raw file object given
    meta = image.meta
  } else { // any other object given
    meta = image
  }
  if (
    has(meta, 'width') &&
    has(meta, 'height') &&
    has(meta, 'ext') &&
    has(meta, 'dir') &&
    has(meta, 'filename')
  ) {
    return new Thumb(meta, width, height, options)
  }
}

/**
 * Plugin
 */
export function createImages() {
  return {
    id: 'avlevere-api-vue-images-plugin',
    name: 'images',
    export: {
      createThumb,
    }
  }
}