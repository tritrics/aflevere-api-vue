import isElem from './isElem'
import getElem from './getElem'
import toInt from './toInt'

export default function getElemTop(mixed) {
  const elem = isElem(mixed) ? mixed : getElem(mixed)
  return isElem(elem) ? toInt(elem.getBoundingClientRect().top)  : 0
}