import { has, isObj, isStr, isFunc } from '../fnlib'
import Request from './Request'
import OptionsWrapper from './Options'
import { subscribe } from '../events'
import { version } from '../../../package.json'

/**
 * The API interface version
 */
export const APIVERSION = 'v1'

/**
 * The tool version
 */
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

export let Options = new OptionsWrapper()

/**
 * Create default options
 */
export function defineConfig(params, reset = false) {
  Options = Options.clone(params, reset)
}

/**
 * Create a request object for use with chainging-functions
 */
export function createRequest(params, callback) {
  return new Request(Options.clone(params), callback)
}

/**
 * request info
 */
export async function getInfo(params, callback) {
  return await createRequest(params, callback).info()
}

/**
 * request node
 */
export async function getNode(node, params, callback) {
  return await createRequest(params, callback).node(node)
}

/**
 * request nodes
 */
export async function getNodes(node, params, callback) {
  return await createRequest(params, callback).nodes(node)
}

/**
 * Generic request
 */
export async function call(node, data) {
  return await createRequest().call(node, data)
}

function setLang(lang) {
  if (isStr(lang, 1)) {
    Options.setLang(lang)
  }
}

/**
 * register the plugin
 */
export async function createApi(params) {
  if (isObj(params)) {
    defineConfig(params)
    subscribe('on-changed-lang', setLang)

    /**
     * Register parser-function in options
     */
    if (has(params, 'parser') && isFunc(params.parser)) {
      const parser = params.parser()
      Options.setParser(parser)
    }

    /**
     * Register i18n language-getter in Options
     * i18n function initializes and returns a getter for language
     * after defineConfig, because i18n uses options to request info
     */
    if (has(params, 'lang') && isFunc(params.lang)) {
      await params.lang()
    }
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
