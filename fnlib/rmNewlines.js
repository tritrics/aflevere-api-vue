import toStr from './toStr'

export default function rmNewlines(val) {
  return toStr(val).replace(/\s+/gm, ' ').trim()
}