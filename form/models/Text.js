import { isStr, isEmpty, extend } from '../../fn'
import { createString } from './index'

export default function createText(def) {
  const inject = {
    type: 'text',
    linebreaks: true,
  }
  return extend(createString(def), inject)
}