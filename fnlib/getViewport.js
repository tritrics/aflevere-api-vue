import isElem from './isElem'
import getElem from './getElem'
import getElemTop from './getElemTop'
import getElemBottom from './getElemBottom'
import getWinHeight from './getWinHeight'

/**
   * visible:
   * element begins to become visible on bottom of the context
   * or bottom begins to become visible on top of the context (= something is visible)
   * 
   * view:
   * the COMPLETE element is visible in context (top and bottom) or,
   * if element is bigger than context, when it fills the complete viewport
   * 
   * top:
   * top of element is scrolled to top of the context and
   * bottom is not scrolled higher than top of context
   * 
   * bottom:
   * bottom of element is scrolled to bottom of the context and
   * top is not scrolled lower than bottom of context
   */
export default function getViewport(mixed) {
  const elem = isElem(mixed) ? mixed : getElem(mixed)
  const res = {
    visible: false,
    view: false,
    top: false,
    bottom: false
  }
  if (isElem(elem)) {
    const node = getElem(elem)
    const top = getElemTop(elem)
    const bottom = getElemBottom(elem)
    const height = getWinHeight()
    res.visible = (top < height) && (bottom > 0)
    res.view = ((top >= 0) && (bottom <= height)) || ((top < 0) && (bottom > height))
    res.top = (top <= 0) && (bottom > 0)
    res.bottom = (bottom <= height) && (top < height)
  }
  return res
}