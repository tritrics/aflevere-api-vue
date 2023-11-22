import toStr from './toStr'
import sanArr from './sanArr'

export default function pathToArr(val) {
  return sanArr(toStr(val).split('/'))
}