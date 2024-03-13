import { computed, watchEffect } from 'vue'
import { toStr } from '../../fn'

/**
 * Base object for all fields
 */
export function createBase() {
  return Object.create({
    type: 'string',
    value: '',
    required: false,
    valid: true,
    msg: '',
    showError: false,
    error: computed(() => {
      !this.valid && this.showError
    }),
    validate() {},
    watchStart() {
      this.watchStop = watchEffect(() => {
        this.validate(this.value) // important to kick off the watchEffect
      })
    },
    watchStop: () => {},
    setValid(msg = true) {
      if (msg === true) {
        this.msg = ''
        this.valid = true
      } else {
        this.msg = msg
        this.valid = false
      }
    },
    data() {
      return this.toString()
    },
    toString() {
      return toStr(this.value)
    },
  })
}