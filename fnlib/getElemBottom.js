import isElem from './isElem'
import getElem from './getElem'
import toInt from './toInt'

export default function getElemBottom(mixed) {
  const elem = isElem(mixed) ? mixed : getElem(mixed)
  return isElem(elem) ? toInt(elem.getBoundingClientRect().bottom) : 0
}