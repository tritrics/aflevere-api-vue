import toStr from './toStr'

export default function regEsc(str) {
  return toStr(str).replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&')
}