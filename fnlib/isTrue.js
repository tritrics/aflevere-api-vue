import toBool from "./toBool"

/**
 * Lazy bool check
 * true, 'true', 'TRUE', 1, '1'
 */
export default function isTrue(val) {
  return toBool(val) === true
}