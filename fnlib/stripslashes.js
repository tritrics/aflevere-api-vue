import toStr from './toStr'

export default function stripslashes(val) {
  return toStr(val).replace(/\\(.)/mg, '$1')
}