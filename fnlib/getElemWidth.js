import isElem from './isElem'
import getElem from './getElem'
import toInt from './toInt'

export default function getElemWidth(mixed) {
  const elem = isElem(mixed) ? mixed : getElem(mixed)
  return isElem(elem) ? toInt(getComputedStyle(elem).width.split('px')[0]) : 0
}