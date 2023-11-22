import toStr from './toStr'

export default function ltrim(val, chars = ' ') {
  let res = toStr(val)
  while (chars.includes(res.charAt(0))) {
    res = res.substring(1)
  }
  return res
}