import { isStr, isEmpty, extend } from '../../fn'
import { createString } from './index'

/**
 * Text field (multisingle line)
 * Kirby: Textarea, Writer
 * 
 * @param {object} def 
 * @returns 
 */
export default function createText(def) {
  const inject = {
    type: 'text',
    linebreaks: true,
  }
  return extend(createString(def), inject)
}