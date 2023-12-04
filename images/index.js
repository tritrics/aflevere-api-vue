import { has } from '../fnlib'
import Thumb from './Thumb'

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

export default Thumb