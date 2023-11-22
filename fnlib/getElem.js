import isStr from './isStr'
import isObj from './isObj'
import has from './has'

export default function getElem(mixed) {
  if (mixed instanceof HTMLElement || mixed === window) {
    return mixed
  } else if (isStr(mixed)) {
    return document.getElementById(mixed)
  } else if (isObj(mixed) && has(mixed, '$el')) {
    return mixed.$el
  }
  return null
}