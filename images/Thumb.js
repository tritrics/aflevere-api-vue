import { inArr, isBool, isInt, isObj, toBool, isStr, objToAttr } from '../fn'

/**
 * Representation of an image with helper functions to create scaled thumbs.
 * This class creates an URL with the scaling options while the thumb is
 * created by the Kirby-plugin. The Kirby-plugin creates and stores the thumb
 * only the first time it's requested.
 * 
 * URL-schema created by this class:
 * 
 * filename[-(width)x(height)][-crop-(option)][-blur(integer)][-bw][-q(integer)].extension
 *
 * - width
 * - height
 * - cropping position
 * - blur (default false)
 * - greyscale (default false)
 * - quality (default 90)
 */
const Thumb = class {

  /**
   * Thumb options
   * 
   * {object}
   */
  options = {
    image: null,
    width: null,
    height: null,
    crop: false,
    blur: 0,
    bw: false,
    quality: null,
    title: null,
    hires: false, // Intern flag for hires scaling (retina displays)
  }

  /**
   * Cropping options
   * 
   * {array}
   */
  croppingOptions = ['top-left', 'top', 'top-right', 'left', 'center', 'right', 'bottom-left', 'bottom', 'bottom-right']

  /**
   * With the constructor the object of the original image is mandatory.
   * All options of the requested thumb can also be given, if not set
   * one-by-one with the setters.
   * 
   * @param {object} image ihe image object of the original (unscaled) like returned from API
   * @param {integer|null} width 
   * @param {integer|null} height 
   * @param {object} options the rest of the options
   */
  constructor(image, width = null, height = null, options = {}) {
    this.options.image = image
    this.options.title = image.title || ''
    this.options.hires = window.devicePixelRatio > 1
    this.dim(width, height)
    this.crop(options.crop || false)
    this.blur(options.blur || null)
    if (toBool(options.bw)) {
      this.bw()
    }
    this.quality(options.quality || null)
  }

  /**
   * Chaining function to set dimension
   * 
   * @param {integer|null} width the width of the thumb, > 0
   * @param {integer} height the height of the thumb, > 0
   * @returns {this}
   */
  dim(width, height) {
    if (!isInt(width, 1) && !isInt(height, 1)) {
      this.options.width = this.options.image.width
      this.options.height = this.options.image.height
    } else {
      this.options.width = isInt(width, 1) ? width : null
      this.options.height = isInt(height, 1) ? height : null
    }
    return this
  }

  /**
   * Chaining function to set crop
   * 
   * @param {string} crop a value from croppingOptions
   * @returns {this}
   */
  crop(crop) {
    if (isBool(crop)) {
      this.options.crop = toBool(crop) ? 'center' : false
    } else if (isStr(crop)) {
      let val = crop.toLowerCase().trim().replace()
      if (inArr(val, this.croppingOptions)) {
        this.options.crop = crop
      }
    }
    return this
  }

  /**
   * Chaining function to set blur
   * 
   * @param {integer} blur blurring effect, >= 0
   * @returns {this}
   */
  blur(blur) {
    if (isInt(blur, 0)) {
      this.options.blur = blur
    }
    return this
  }

  /**
   * Chaining function to set image to black/white
   * 
   * @returns {this}
   */
  bw() {
    this.options.bw = true
    return this
  }

  /**
   * Chaining function to set JPEG quality
   * 
   * @param {integer} quality 1 <= quality <= 100
   * @returns {this}
   */
  quality(quality) {
    if (isInt(quality, 1, 100)) {
      this.options.quality = quality
    }
    return this
  }

  /**
   * Getter for thumb-tag attributes, optionally as object or string.
   * 
   * @param {boolean} asString 
   * @returns {object|string}
   */
  attr(asString) {
    if (!isObj(this.options.image)) {
      return
    }
    const attr = this.calculateThumb()
    attr.crossorigin = null
    if (this.options.title) {
      attr.alt = this.options.title
    }
    return toBool(asString) ? objToAttr(attr) : attr
  }

  /**
   * Getter for the thumb html-tag
   * @returns {string}
   */
  tag() {
    return `<img ${this.attr(true)} />`
  }

  /**
   * Preload the image
   * 
   * @returns {Promise}
   */
  async preload() {
    const attr = this.calculateThumb()
    return new Promise((resolve, reject) => {
      const Preload = new Image()
      Preload.onload = resolve
      Preload.onerror = reject
      Preload.src = attr.src
    })
  }

  /**
   * Helper to calculate all options for the thumb-url.
   * 
   * @returns {object}
   */
  calculateThumb() {
    const res = this.calculateDimensions()
    const ext = this.options.image.ext.toLowerCase().replace(/jpeg/, 'jpg')
    const src = []
    src.push(this.options.image.dir + this.options.image.filename)
    src.push(`${res.width}x${res.height}`)
    if (isStr(this.options.crop)) {
      src.push(`crop-${this.options.crop}`)
    }
    if (this.options.blur !== null && this.options.blur > 0) {
      src.push(`blur${this.options.blur}`)
    }
    if (this.options.bw === true) {
      src.push('bw')
    }
    if (this.options.quality !== null && this.options.quality > 0) {
      src.push(`q${this.options.quality}`)
    }
    res.src = `${src.join('-')}.${ext}`
    return res
  }

  /**
   * Helper to calculate the dimensions for the thumb-url.
   * 
   * @returns {object}
   */
  calculateDimensions() {
    const res = {
      width: this.options.width,
      height: this.options.height
    }

    // keep ratio, limit height to maxHeight
    const ratio = this.options.image.width / this.options.image.height
    if (this.options.width === null) {
      res.width = Math.round(this.options.height * ratio, 0)
      res.height = this.options.height
    }
    
    // keep ratio, limit width to width
    else if (this.options.height === null) {
      res.width = this.options.width
      res.height = Math.round(this.options.width / ratio, 0)
    }
    
    // crop to fit in width and height
    else if (isStr(this.crop)) {
      res.width = this.options.width
      res.height = this.options.height
    }
    
    // keep ratio, fit either width or height
    else {
      res.width = Math.round(this.options.height * ratio, 0)
      if (res.width <= this.options.width) {
        res.height = this.options.height
      } else {
        res.width = this.options.width
        res.height = Math.round(this.options.width / ratio, 0)
      }
    }

    // double resolution for hiRes displays
    if (this.options.hiRes) {
      res.width *= 2
      res.height *= 2
    }

    // correct the dimensions to not be bigger than original
    if ((res.width / this.options.image.width) > 1 || (res.height / this.options.image.height) > 1) {

      // take this.options.image.width and calculate height
      if ((res.width / this.options.image.width) >= (res.height / this.options.image.height)) {
        if (this.options.height === null) {
          res.height = this.options.image.height
        } else {
          res.height = Math.floor((this.options.image.width * res.height) / res.width)
        }
        res.width = this.options.image.width
      }
      
      // take this.options.image.height and calculate width
      else {
        if (this.options.width === null) {
          res.width = this.options.image.width
        } else {
          res.width = Math.floor((this.options.image.height * res.width) / res.height)
        }
        res.height = this.options.image.height
      }
    }
    return res
  }

  toString() {
    return 'Instance of class Thumb'
  }
}

export default Thumb
