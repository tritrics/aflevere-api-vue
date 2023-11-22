import { inArr, isBool, isInt, isObj, toBool, isStr, attrToStr } from '../fnlib'

const Thumb = class {
  image = null

  width = null

  height = null

  crop = false

  blur = 0

  bw = false

  quality = null

  title = null

  hires = false

  constructor(image, width = null, height = null, options = {}) {
    this.image = image
    this.title = image.title || ''
    this.hires = window.devicePixelRatio > 1
    this._dim(width, height)
    this._crop(options.crop || false)
    this._blur(options.blur || null)
    if (toBool(options.bw)) {
      this._bw()
    }
    this._quality(options.quality || null)
  }

  async _preload() {
    return new Promise((resolve, reject) => {
      const Preload = new Image()
      Preload.onload = resolve
      Preload.onerror = reject
      Preload.src = this.src()
    })
  }

  _dim(width, height) {
    if (!isInt(width, 1) && !isInt(height, 1)) {
      this.width = this.image.width
      this.height = this.image.height
    } else {
      this.width = isInt(width, 1) ? width : null
      this.height = isInt(height, 1) ? height : null
    }
    return this
  }
  
  _crop(crop) {
    if (isBool(crop)) {
      this.crop = toBool(crop) ? 'center' : false
    } else if (isStr(crop)) {
      let val = crop.toLowerCase().trim().replace()
      if (inArr(val, ['top-left', 'top', 'top-right', 'left', 'center', 'right', 'bottom-left', 'bottom', 'bottom-right'])) {
        this.crop = crop
      }
    }
    return this
  }

  _blur(blur) {
    if (isInt(blur, 0)) {
      this.blur = blur
    }
    return this
  }

  _bw() {
    this.bw = true
    return this
  }

  _quality(quality) {
    if (isInt(quality, 1, 100)) {
      this.quality = quality
    }
    return this
  }

  // getter for attributes
  _attr(asString) {
    if (!isObj(this.image)) {
      return
    }
    const attr = this.calculateThumb()
    attr.crossorigin = null
    if (this.title) {
      attr.alt = this.title
    }
    return toBool(asString) ? attrToStr(attr) : attr
  }

  _tag() {
    return `<img ${this._attr(true)} />`
  }

  _val () {
    return {
      width:  this.width,
      height:  this.height,
      crop:  this.crop,
      blur:  this.blur,
      bw:  this.bw,
      quality:  this.quality,
      title:  this.title,
      hires:  this.hires,
    }
  }

  _str() {
    const attr = this.calculateThumb()
    return attr.src
  }

  toString() {
    return this._tag()
  }

  calculateThumb() {
    const res = this.calculateDimensions()
    const ext = this.image.ext.toLowerCase().replace(/jpeg/, 'jpg')
    const src = []
    src.push(this.image.dir + this.image.filename)
    src.push(`${res.width}x${res.height}`)
    if (isStr(this.crop)) {
      src.push(`crop-${this.crop}`)
    }
    if (this.blur !== null && this.blur > 0) {
      src.push(`blur${this.blur}`)
    }
    if (this.bw === true) {
      src.push('bw')
    }
    if (this.quality !== null && this.quality > 0) {
      src.push(`q${this.quality}`)
    }
    res.src = `${src.join('-')}.${ext}`
    return res
  }

  calculateDimensions() {
    const res = {
      width: this.width,
      height: this.height
    }

    // keep ratio, limit height to maxHeight
    const ratio = this.image.width / this.image.height
    if (this.width === null) {
      res.width = Math.round(this.height * ratio, 0)
      res.height = this.height
    }
    
    // keep ratio, limit width to width
    else if (this.height === null) {
      res.width = this.width
      res.height = Math.round(this.width / ratio, 0)
    }
    
    // crop to fit in width and height
    else if (isStr(this.crop)) {
      res.width = this.width
      res.height = this.height
    }
    
    // keep ratio, fit either width or height
    else {
      res.width = Math.round(this.height * ratio, 0)
      if (res.width <= this.width) {
        res.height = this.height
      } else {
        res.width = this.width
        res.height = Math.round(this.width / ratio, 0)
      }
    }

    // double resolution for hiRes displays
    if (this.hiRes) {
      res.width *= 2
      res.height *= 2
    }

    // correct the dimensions to not be bigger than original
    if ((res.width / this.image.width) > 1 || (res.height / this.image.height) > 1) {

      // take this.image.width and calculate height
      if ((res.width / this.image.width) >= (res.height / this.image.height)) {
        if (this.height === null) {
          res.height = this.image.height
        } else {
          res.height = Math.floor((this.image.width * res.height) / res.width)
        }
        res.width = this.image.width
      }
      
      // take this.image.height and calculate width
      else {
        if (this.width === null) {
          res.width = this.image.width
        } else {
          res.width = Math.floor((this.image.height * res.width) / res.height)
        }
        res.height = this.image.height
      }
    }
    return res
  }
}

export default Thumb
