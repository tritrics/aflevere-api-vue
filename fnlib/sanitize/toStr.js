export default function toStr(val) {
  return typeof val === 'object' ? '' : `${val}`
}