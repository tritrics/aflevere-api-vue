import { has, isObj, isFunc } from './fnlib'
import Request from './api/Request'
import Options from './api/Options'
import { version } from '../../package.json'

export const VERSION = version

/**
 * Default options are defined on initialisation by createApi() or separately 
 * by defineConfig(). Default Options are used for every request.
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
export function defineConfig(options, reset = false) {
  defaultOptions = reset ? new Options(options) : defaultOptions.clone(options)
}

/**
 * Create a request object for use with chainging-functions
 */
export function createRequest(options, callback) {
  return new Request(defaultOptions.clone(options), callback)
}

/**
 * request info
 */
export async function getInfo(options, callback) {
  return await createRequest(options, callback).info()
}

/**
 * request node
 */
export async function getNode(node, options, callback) {
  return await createRequest(options, callback).node(node)
}

/**
 * request nodes
 */
export async function getNodes(node, options, callback) {
  return await createRequest(options, callback).nodes(node)
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
export async function createApi(_options) {
  if (isObj(_options)) {
    defineConfig(_options)
  }
  if (has(defaultOptions, 'lang') && isFunc(defaultOptions.lang)) {
    defaultOptions.lang = await defaultOptions.lang() // call factory, inits languages and returns a getter for the language
  }
  return {
    install(app) {
      app.config.globalProperties.$api = {
        defineConfig,
        createRequest,
        getInfo,
        getNodes,
        getNode,
        call,
        VERSION,
      }
    },
  }
}
