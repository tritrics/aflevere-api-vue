import { extend } from '../../fn'
import Thumb from '../../api/Thumb'

/**
 * Model for thumb, used by model Image
 *
 * @param {object} obj the field data
 * @param {integer|null} width
 * @param {integer|null} height
 * @param {object} options
 * @returns {object}
 */
export default function createThumb(obj, width = null, height = null, options = {}) {
  const functions = {
    // Option-Functions are chainable
    $dim() {
      this.$value.dim(...arguments)
      return this
    },
    $crop() {
      this.$value.crop(...arguments)
      return this
    },
    $blur() {
      this.$value.blur(...arguments)
      return this
    },
    $bw() {
      this.$value.bw()
      return this
    },
    $quality() {
      this.$value.quality(...arguments)
      return this
    },
    $attr() {
      return this.$value.attr(...arguments)
    },
    $tag() {
      return this.$value.tag(...arguments)
    },
    async $preload() {
      return this.$value.preload()
    },
    $str() {
      const attr = this.$value.calculateThumb()
      return attr.src
    },
    $val() {
      return this.$value.options
    },
    toString() {
      return this.tag()
    },
  }
  
  const data = {
    $type: 'thumb',
    $value: new Thumb(obj, width, height, options),
  }
  return extend(functions, data)
}
