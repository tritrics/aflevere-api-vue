import { isArr } from '../index'

export default function unique(arr) {
  return isArr(arr) ? [...new Set(arr)] : []
}