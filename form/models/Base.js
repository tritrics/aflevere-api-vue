import { watchEffect } from 'vue'
import { toStr, isEmpty, uuid } from '../../fn'

/**
 * Base object for all fields
 */
export default function createBase() {
  return Object.create({
    type: 'string',
    id: uuid(),
    value: '',
    required: false,
    valid: true,
    msg: '',
    validate() {},
    setValid(msg = '') {
      this.valid = isEmpty(msg)
      this.msg = msg
    },
    watch(start = true) {
      if (start) {
        if(this._watchStopFn === null) {
          this._watchStopFn = watchEffect(() => {
            this.validate(this.value) // important to kick off the watchEffect
          })
        }
      } else if (this._watchStopFn !== null) {
        this._watchStopFn()
        this._watchStopFn = null
      }
    },
    data() {
      return toStr(this.value)
    },
    toString() {
      return toStr(this.data())
    },
    _watchStopFn: null,
  })
}