import { isObj } from './fnlib'
import Request from './api/Request'
import Options from './api/Options'
import { version } from '../../package.json'

export const VERSION = version

/**
 * Default options are defined on initialisation by createApi() or separately 
 * by setOptions(). Default Options are used for every request.
 * 
 * Default options can be optionally overwritten for a single request in three ways:
 * 1. getNode(node, {Object} options)
 * 2. createRequest({Object} options)[...]
 * 3. createRequest().limit(5).fields(...)[...]
 */
let defaultOptions = new Options()

/**
 * Create default options
 */
export function setOptions(options, reset = false) {
  defaultOptions = reset ? new Options(options) : defaultOptions.clone(options)
}

/**
 * Create a request object for use with chainging-functions
 */
export function createRequest(options, callback) {
  return new Request(defaultOptions.clone(options), callback)
}

/**
 * request languages
 */
export async function getLanguages(options, callback) {
  return await createRequest(options, callback).languages()
}

/**
 * request children
 */
export async function getCollection(node, options, callback) {
  return await createRequest(options, callback).collection(node)
}

/**
 * request node
 */
export async function getNode(node, options, callback) {
  return await createRequest(options, callback).node(node)
}

/**
 * Generic request
 */
export async function call(node, data) {
  return await createRequest().call(node, data)
}

/**
 * register the plugin
 * @param {Object} _options, optional
 */
export function createApi(_options) {
  if (isObj(_options)) {
    setOptions(_options)
  }
  return {
    install(app) {
      app.config.globalProperties.$api = {
        setOptions,
        createRequest,
        getLanguages,
        getCollection,
        getNode,
        call,
        VERSION,
      }
    },
  }
}
