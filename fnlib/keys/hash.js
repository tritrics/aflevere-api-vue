import { toStr } from '../index'

export default function hash(uri) {
  return toStr(uri).replace(/[?|&|/|=]/g, '_').replace(/\[\]/g, '')
}