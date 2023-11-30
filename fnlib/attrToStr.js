import each from './each'
import isObj from './isObj'
import isStr from './isStr'
import isNum from './isNum'
import addSlashes from './addSlashes'

export default function attrToStr() {
  let attr = {}
  each(arguments, (obj) => {
    if (isObj(obj)) {
      attr = { ...attr, ...obj }
    }
  })
  const start = []
  const end = []
  each(attr, (value, key) => {
    if (isStr(value) || isNum(value)) {
      const attr = `${key}="${addSlashes(value)}"`
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