import { each, toStr, isNum, isStr, trim, isUrl } from '../index'

/**
 * Creates a slash-separated path or url from any kind of parameters.
 * Adds a leading slash, if it's not an url.
 * 
 * @param  {...any} args multiple strings
 * @returns {string}
 */
export default function toPath(...args) {
  const res = []
  each(args, (arg) => {
    if(isNum(arg)) {
      arg = toStr(arg)
    } else if (isStr(arg)) {
      arg = trim(arg, true, true, '/')
    }
    if (isStr(arg, 1)) {
      res.push(encodeURI(arg))
    }
  })
  const path = res.join('/')
  return isUrl(path) ? path : `/${path}`
}