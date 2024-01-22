import { each } from '../index'

export default function toParams(obj) {
  const res = []
  each(obj, (value, key) => {
    res.push(`${key}=${encodeURIComponent(value)}`)
  })
  return res.join('&')
}