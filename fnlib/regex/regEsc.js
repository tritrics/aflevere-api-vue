import { toStr } from '../index'

export default function regEsc(str) {
  return toStr(str).replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&')
}