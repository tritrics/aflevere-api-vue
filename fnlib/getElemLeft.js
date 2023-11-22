import isElem from './isElem'
import getElem from './getElem'
import toInt from './toInt'

export default function getElemLeft(mixed) {
  const elem = isElem(mixed) ? mixed : getElem(mixed)
  return isElem(elem) ? toInt(elem.offsetLeft) : 0
}