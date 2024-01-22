import { toStr } from '../index'

export default function stripslashes(val) {
  return toStr(val).replace(/\\(.)/mg, '$1')
}