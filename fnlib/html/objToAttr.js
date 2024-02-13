import { each, isStr, isNum, addSlashes } from '../index'

/**
 * Convert an object to htmlelement attributes.
 * @param {object} obj
 * @returns {string}
 */
export default function objToAttr(obj) {
  const start = []
  const end = []
  each(obj, (val, key) => {
    if (isStr(val) || isNum(val)) {
      const attr = `${key}="${addSlashes(val)}"`
      if (key === 'href' || key === 'to') {
        start.unshift(attr)
      } else {
        start.push(attr)
      }
    } else {
      end.push(key)
    }
  })
  return start.concat(end).join(' ')
}