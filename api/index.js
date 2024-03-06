import { has, unset, each, isObj, isStr, isFunc, inArr, sanArr } from '../fn'
import Thumb from './Thumb'
import Request from './Request'
import RequestOptions from './Options'
import { version } from '../../../package.json'

/**
 * The API interface version.
 * Same as defined in Kirby-Plugin and required for all requests.
 */
export const APIVERSION = 'v1'

/**
 * The Plugin version.
 */
export const VERSION = version

/**
 * Options
 * 
 * Default options are defined on initialisation by createApi() or separately 
 * by defineConfig(). Default Options are used for every request.
 * 
 * Default options can be optionally overwritten for a single request in three ways:
 * 1. getPage(node, {Object} options)
 * 2. createRequest({Object} options)[...]
 * 3. createRequest().limit(5).fields(...)[...]
 */
let Options = new RequestOptions()

/**
 * Create (default) options for all requests.
 * 
 * @param {object} params the options to set
 * @param {boolean} reset replace all existing settings instead of merging
 */
export function defineConfig(params, reset = false) {
  Options = Options.clone(params, reset)
}

/**
 * Create a request object for use with chainging-functions.
 * 
 * @param {object} params optionally overwrite or amend default options
 * @returns {Request}
 */
export function createRequest(params = {}) {
  return new Request(Options.clone(params))
}

/**
 * Call API interface /info.
 * Returns global information about the site.
 * 
 * @param {object} params optionally overwrite or amend default options
 * @returns {object} json
 */
export async function getInfo(params = {}) {
  return await createRequest(params).info()
}

/**
 * Call API interface /language/(:any).
 * Returns information from a single language.
 * 
 * @param {string} lang 2-char language code
 * @param {object} params optionally overwrite or amend default options
 * @returns {object} json
 */
export async function getLanguage(lang, params = {}) {
  return await createRequest(params).language(lang)
}

/**
 * Call API interface /page/(:all?).
 * Returns information of a single page or site (if node is empty).
 * 
 * @param {string} path the path to the page
 * @param {object} params optionally overwrite or amend default options
 * @returns {object} json
 */
export async function getPage(path, params = {}) {
  return await createRequest(params).page(path)
}

/**
 * Call API interface /pages/(:all?).
 * Returns information of sub-pages of a single page or site (if node is empty).
 * 
 * @param {string} path the path to the parent page
 * @param {object} params optionally overwrite or amend default options
 * @returns {object} json
 */
export async function getPages(path, params = {}) {
  return await createRequest(params).pages(path)
}

/**
 * Submit data to a specified action /action/(:any).
 * 
 * @param {string} action the action
 * @param {object} data post-data
 * @param {object} params optionally overwrite or amend default options
 * @returns {object} json
 */
export async function createAction(action, data = {}, token = null, params = {}) {
  return await createRequest(params).create(action, data)
}

/**
 * Generic API-request
 * 
 * @param {string} path
 * @param {object} data post-data
 * @param {object} params optionally overwrite or amend default options
 * @returns {object} json
 */
export async function apiCall(path, data = {}, params = {}) {
  return await createRequest(params).call(path, data)
}

/**
 * Create a Thumb instance with handy image resizing and handling methods.
 * 
 * @param {object} image the image object/node from response
 * @param {integer} width the thumb width in px
 * @param {integer} height the thumb height in px
 * @param {object} options the thumb's options
 * @returns {Thumb}
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
 * Simple and basic event bus for communication between Plugins.
 */
const registeredEvents = {}

/**
 * Subscribe to an event.
 * 
 * @param {string} event the name of the event
 * @param {function} callback the callback-function when event is triggered
 */
export function subscribe(event, callback) {
  if (isStr(event) && isFunc(callback)) {
    if (!has(registeredEvents, event)) {
      registeredEvents[event] = []
    }
    registeredEvents[event].push(callback)
  }
}

/**
 * Trigger an event.
 * 
 * @param {string} event the name of the event
 * @param {mixed} payload any optional data wich is sent to the callback-function
 */
export async function publish(event, payload = null) {
  if (has(registeredEvents, event)) {
    for (let i = 0; i < registeredEvents[event].length; i++) {
      await registeredEvents[event][i](payload)
    }
  }
}

/**
 * Internally used function to set the language in Options.
 * 
 * @param {string} lang 2-char language code
 */
function setLang(lang) {
  Options.setLang(lang)
}

/**
 * Internally used function to "inform" Options that this is a multilang installation.
 * 
 * @param {boolean} multilang 
 */
function setMultilang(multilang) {
  Options.setMultilang(multilang)
}

/**
 * Registered plugins as given with createApi(params)
 * Plugins here mean: Plugins of the API-Plugin.
 */
const registeredPlugins = []

/**
 * Check if a plugin given by it's name is exists.
 * 
 * @param {string} name 
 * @returns {boolean}
 */
export function hasPlugin(name) {
  return inArr(name, registeredPlugins)
}

/**
 * Default parser function doing nothing.
 * Function is replaced by the parser-plugin.
 * 
 * @param {object} json 
 * @returns {object}
 */
export let parse = (json) => json 

/**
 * Creating the Vue-Plugin.
 * 
 * Params should at least contain the host (url of the Kirby-Installation).
 * Example:
 * {
 *   host: 'http://some-domain.com/public-api',
 *
 *   // if multilang installation
 *   lang: 'de',
 *
 *   // register plugins
 *   plugins: [
 *    createParser(parserOptions),
 *    createI18n(),
 *    createSite(),
 *  ]
 * }
 * 
 * @param {object} params 
 * @returns 
 */
export async function createApi(params) {

  // handle params, init
  const pluginName = has(params, 'pluginName') ? params.pluginName : 'api'
  const plugins = has(params, 'plugins') ? params.plugins : []
  if (isObj(params)) {
    unset(params, 'plugins')
    unset(params, 'pluginName')
    defineConfig(params)
  }
  subscribe('on-changed-langcode', setLang)
  subscribe('on-changed-multilang', setMultilang)

  // sort plugins
  // reserved positions: 0 = parser, 1 = i18n, 2 = site
  // the rest is user-defined and added in the given order
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
        getPage,
        getPages,
        createAction,
        apiCall,
        createThumb,
        hasPlugin,
        subscribe,
        publish,
        parse,
      }
      app.provide(pluginName,  app.config.globalProperties[`$${pluginName}`])

      // add plugins, usage: $api.site or inject('api.site')
      each(pluginsSorted, (def) => {
        app.config.globalProperties[`$${pluginName}`][def.name] = def.export
        app.provide(`${pluginName}.${def.name}`, def.export)
      })
    }
  }
}