import { isIterable, isArr, isObj, clone, unique, each, Options } from '../index'

/**
 * Method to deep merge multiple objects or arrays where arrays as values are
 * also handled. Result is returned as a new object/array. Use like
 * 
 * const result = merge(obj1, obj2[, obj3, ...[, Options]])
 * 
 * Options are optional and must be instance of Options.
 * Possible settings:
 * {
 *  arrays: [true|false], // merge arrays (relevant only when objects are merged)
 *  unique: [true|false], // set arrays to unique entries after merge
 * }
 * 
 * @param {Object} multiple objects or arrays
 * @param {boolean} optional boolean as last param
 * @returns Object
 */
export default function merge() {
  let res = null
  let mergeOptions = null
  const args = [ ...arguments ]
  if (!args.length) {
    return res
  }

  // get Options from last param
  if(args.length > 2 && arguments[args.length - 1] instanceof Options) {
    mergeOptions = args.pop()
  } else {
    mergeOptions = new Options( { arrays: true, unique: true } )
  }

  // first element determines if array of objects are merged  
  // merge arrays
  if (isArr(arguments[0])) {
    res = []
    const arrs = args.map((arr) => {
      return isArr(arr) ? arr : [ arr ]
    })
    each(arrs, arr => {
      res = [ ...res, ...arr ]
    })
    if (mergeOptions.get('unique')) {
      res = unique(res)
    }
  }
  
  // merge objects
  else if (isObj(arguments[0])) {
    res = {}
    const objs = args.filter((obj) => {
      return isObj(obj) ? obj : false
    })
    each(objs, obj => {
    for (let key of Object.keys(obj)) {
      if (isObj(res[key]) && isObj(obj[key])) {
        res[key] = merge(res[key], obj[key], mergeOptions)
        continue
      }
      if (isArr(res[key]) && isArr(obj[key]) && mergeOptions.get('arrays')) {
        res[key] = merge(res[key], obj[key], mergeOptions)
        continue
      }
      res[key] = isIterable(obj[key]) ? clone(obj[key]) : obj[key]
    }
  })
  }
  return res
}