import toStr from './toStr'
import isStr from './isStr'
import trim from './trim'

/**
 * Creates an uri with leading slash from any kind of given parameters
 */
export default function toPath(...args) {
  const res = []
  for (let i = 0; i < args.length; i += 1) {
    let arg = toStr(args[i])
    if (isStr(arg, 1)) {
      res.push(trim(arg, '/'))
    }
  }
  return encodeURI(`/${res.join('/')}`)
}