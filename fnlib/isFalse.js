import toBool from './toBool'

/**
 * Lazy bool check
 * NOT true, 'true', 'TRUE', 1, '1'
 */
export default function isFalse(val) {
  return toBool(val) !== true
}