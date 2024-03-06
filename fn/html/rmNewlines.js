import { toStr } from '../index'

export default function rmNewlines(val) {
  return toStr(val).replace(/\s+/gm, ' ').trim()
}