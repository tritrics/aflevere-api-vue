import isArr from './isArr'

export default function unique(arr) {
  return isArr(arr) ? [...new Set(arr)] : []
}