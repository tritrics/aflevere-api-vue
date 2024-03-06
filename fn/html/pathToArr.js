import { toStr, sanArr } from '../index'

export default function pathToArr(val) {
  return sanArr(toStr(val).split('/'))
}