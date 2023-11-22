import toStr from './toStr'

export default function hash(uri) {
  return toStr(uri).replace(/[?|&|/|=]/g, '_').replace(/\[\]/g, '')
}