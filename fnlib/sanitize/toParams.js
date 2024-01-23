import { each } from '../index'

/**
 * Creates a url get-parameter string from an object.
 * 
 * @param {object} obj 
 * @returns {string} &foo=1&bar=2
 */
export default function toParams(obj) {
  const res = []
  each(obj, (value, key) => {
    res.push(`${key}=${encodeURIComponent(value)}`)
  })
  return res.join('&')
}