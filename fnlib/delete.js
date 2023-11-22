import isArr from './isArr'
import isObj from './isObj'
import has from './has'

export default function deleteNode(obj, key) {
  if (!has(obj, key)) {
    return
  }
  if (isArr(obj)) {
    obj.splice(key, 1)
  } else if (isObj(obj)) {
    delete obj[key]
  }
}