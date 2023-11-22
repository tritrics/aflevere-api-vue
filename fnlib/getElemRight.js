import isElem from './isElem'
import getElem from './getElem'
import getElemWidth from './getElemWidth'
import getElemLeft from './getElemLeft'

export default function getElemRight(mixed) {
  const elem = isElem(mixed) ? mixed : getElem(mixed)
  return isElem(elem) ? getElemLeft(elem) + getElemWidth(elem) : 0
}