import { has, unset, each, isObj, isStr, isFunc, inArr, sanArr } from '../fnlib'
import Thumb from './Thumb'
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
 * Options
 */

/**
 * Default options are defined on initialisation by createApi() or separately 
 * by defineConfig(). Default Options are used for every request.
 * 
 * Default options can be optionally overwritten for a single request in three ways:
 * 1. getNode(node, {Object} options)
 * 2. createRequest({Object} options)[...]
 * 3. createRequest().limit(5).fields(...)[...]
 */

let Options = new OptionsWrapper()

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
 * Image handling
 */

export function createThumb(image, width = null, height = null, options = {}) {
  let meta = {}
  if (has(image, '$meta')) { // parser object given
    meta = image.$meta
  } else if (has(image, 'meta')) { // raw file object given
    meta = image.meta
  } else { // any other object given
    meta = image
  }
  if (
    has(meta, 'width') &&
    has(meta, 'height') &&
    has(meta, 'ext') &&
    has(meta, 'dir') &&
    has(meta, 'filename')
  ) {
    return new Thumb(meta, width, height, options)
  }
}

/**
 * very simple mini event bus for communication between Plugins
 */
const registeredEvents = {}

export function subscribe(event, callback) {
  if (isStr(event) && isFunc(callback)) {
    if (!has(registeredEvents, event)) {
      registeredEvents[event] = []
    }
    registeredEvents[event].push(callback)
  }
}

export async function publish(event, payload = null) {
  if (has(registeredEvents, event)) {
    for (let i = 0; i < registeredEvents[event].length; i++) {
      await registeredEvents[event][i](payload)
    }
  }
}

function setLang(lang) {
  Options.setLang(lang)
}

function setMultilang(multilang) {
  Options.setMultilang(multilang)
}

/**
 * Plugin
 */
const registeredPlugins = []

export function hasPlugin(name) {
  return inArr(name, registeredPlugins)
}

/**
 * default parser function, is overwritten by parser
 */
export let parse = (json) => json 

export async function createApi(params) {

  // handle params, init
  const pluginName = has(params, 'pluginName') ? params.pluginName : 'api'
  const plugins = has(params, 'plugins') ? params.plugins : []
  if (isObj(params)) {
    unset(params, 'plugins')
    unset(params, 'pluginName')
    defineConfig(params)
  }
  subscribe('on-changed-lang', setLang)
  subscribe('on-changed-multilang', setMultilang)


  /**
   * sort plugins
   * reserved positions: 0 = parser, 1 = i18n, 2 = site
   * the rest is user-defined and added in the given order
   */
  let pluginsSorted = [null, null, null]
  each (plugins, (plugin) => {
    switch(plugin.id) {
      case 'avlevere-api-vue-parser-plugin':
        pluginsSorted[0] = plugin
        break
      case 'avlevere-api-vue-i18n-plugin':
        pluginsSorted[1] = plugin
        break
      case 'avlevere-api-vue-site-plugin':
        pluginsSorted[2] = plugin
        break
      default:
        pluginsSorted.push(plugin)
    }
  })
  pluginsSorted = sanArr(pluginsSorted)
  for (let i = 0; i < pluginsSorted.length; i++) {
    if (!has(pluginsSorted[i], 'name')) {
      continue
    }
    if (has(pluginsSorted[i], 'parse')) {
      parse = pluginsSorted[i].parse
    }
    if (has(pluginsSorted[i], 'init')) {
      await pluginsSorted[i].init()
    }
    registeredPlugins.push(pluginsSorted[i].name)
  }

  // register plugin
  return {
    install(app, options) {
      app.config.globalProperties[`$${pluginName}`] = {
        APIVERSION,
        VERSION,
        defineConfig,
        createRequest,
        getInfo,
        getNode,
        getNodes,
        apiCall,
        createThumb,
        hasPlugin,
        subscribe,
        publish,
        parse,
      }
      app.provide(pluginName,  app.config.globalProperties[`$${pluginName}`])

      /**
       * add plugins, usage: $api.site or inject('api.site')
       */
      each(pluginsSorted, (def) => {
        app.config.globalProperties[`$${pluginName}`][def.name] = def.export
        app.provide(`${pluginName}.${def.name}`, def.export)
      })
    }
  }
}