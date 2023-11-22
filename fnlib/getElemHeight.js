import isElem from './isElem'
import getElem from './getElem'
import toInt from './toInt'

export default function getElemHeight(mixed) {
  const elem = isElem(mixed) ? mixed : getElem(mixed)
  return isElem(elem) ? toInt(getComputedStyle(elem).height.split('px')[0]) : 0
}