import { isObj, isStr } from '../index'

/**
 * Get a subnode from a nested object by giving the keys as a dot-separated string.
 * Example: getByPath(obj, 'person.address.street')
 * 
 * @param {object} obj 
 * @param {string} path dot-separated keys
 * @param {mixed} returnDefault default return, if node does not exist
 * @returns {mixed}
 */
export default function getByPath(obj, path, returnDefault = null) {
  if (!isObj(obj) || !isStr(path)) {
    return returnDefault
  }
  let node = obj
  const pathArray = path.split('.')
  for (let i = 0; i < pathArray.length; i += 1) {
    if (!Object.prototype.propertyIsEnumerable.call(node, pathArray[i])) {
      return returnDefault
    }
    const child = node[pathArray[i]]
    if (child === undefined || child === null) {
      if (i !== pathArray.length - 1) {
        return returnDefault
      }
      break
    }
    node = child
  }
  return node
}