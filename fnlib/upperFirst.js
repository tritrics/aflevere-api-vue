import toStr from './toStr'

export default function upperFirst(val) {
  const i = toStr(val)
  return i.charAt(0).toUpperCase() + i.slice(1)
}