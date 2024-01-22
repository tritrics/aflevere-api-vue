import { each, toStr, isNum, isStr, trim, isUrl } from '../index'

/**
 * Creates a path or url from any kind of parameters
 * adds a leading slash, if it's not an url
 */
export default function toPath(...args) {
  const res = []
  each(args, (arg) => {
    if(isNum(arg)) {
      arg = toStr(arg)
    } else if (isStr(arg)) {
      arg = trim(arg, '/')
    }
    if (isStr(arg, 1)) {
      res.push(encodeURI(arg))
    }
  })
  const path = res.join('/')
  return isUrl(path) ? path : `/${path}`
}