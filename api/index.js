import { has, each, isObj, isStr, isFunc, unset } from '../fnlib'
import Request from './Request'
import OptionsWrapper from './Options'
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

export let Options = null

/**
 * very simple mini event bus for communication between Plugins
 */
const events = {}

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
export async function apiCall(node, data) {
  return await createRequest().call(node, data)
}

/**
 * subcribe to an event
 */
export function subscribe(event, callback) {
  if (isStr(event) && isFunc(callback)) {
    if (!has(events, event)) {
      events[event] = []
    }
    events[event].push(callback)
  }
}

/**
 * dispatch an event
 */
export function publish(event, payload = null) {
   if (isStr(event) && has(events, event)) {
    each(events[event], (callback) => {
      callback(payload)
    })
   }
}

export function getPluginName(options, name) {
  if (has(options, 'pluginName') && isStr(options.pluginName, 1)) {
    const customName = options.pluginName
    unset(options, 'pluginName')
    return customName
  }
  return name
}

/**
 * register the plugin
 */
export function createApi(params) {
  const pluginName = getPluginName(params, 'api')
  Options = new OptionsWrapper()
  if (isObj(params)) {
    defineConfig(params)

    // Language setter for event on-changed-lang, if i18n plugin exists
    subscribe('on-changed-lang', (lang) => {
      if (isStr(lang, 1)) {
        Options.setLang(lang)
      }
    })

    // register parser
    if (has(params, 'parser') && isFunc(params.parser)) {
      const parser = params.parser()
      Options.setParser(parser)
    }
  }

  // register plugin
  return {
    install(app, options) {
      app.config.globalProperties[`$${pluginName}`] = {
        APIVERSION,
        VERSION,
        Options,
        defineConfig,
        createRequest,
        getInfo,
        getNode,
        getNodes,
        apiCall,
        subscribe,
        publish,
      }
      app.provide(pluginName, app.config.globalProperties[`$${pluginName}`])
    }
  }
}