import toStr from './toStr'

export default function rtrim(val, chars = ' ') {
  let res = toStr(val)
  while (chars.includes(res.charAt(res.length - 1))) {
    res = res.substring(0, res.length - 1)
  }
  return res
}