import { extend, has, isEmpty, isUrl, toStr, isTrue } from '../../fn'
import { createBase } from './index'

/**
 * Url field
 * Kirby: Url
 * 
 * @param {object} def 
 * @returns 
 */
export default function createUrl(def) {
  const inject = {
    type: 'email',
    value: has(def, 'value') ? toStr(def.value) : '',
    required: has(def, 'required') && isTrue(def.required) ? true : false,
    validate() {
      if (isEmpty(this.value)) {
        if (this.required) {
          return this.setValid('required')
        }
      } else if(!isUrl(this.value)) {
        return this.setValid('type')
      }
      return this.setValid()
    },
  }
  return extend(createBase(), inject)
}