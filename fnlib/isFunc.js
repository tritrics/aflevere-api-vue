export default function isFunc(val) {
  return val && (typeof val === 'function' || {}.toString.call(val) === '[object Function]')
}