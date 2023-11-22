export default function isObj(val) { // experimental
  const check = Object.prototype.toString.call(val).toLowerCase()
  return check === '[object object]' || check === '[object arguments]'
}