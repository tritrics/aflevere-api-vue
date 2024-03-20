import { has, unset, each, isObj } from '../fn'
import Request from './Request'
import RequestOptions from './Options'
import { loadPlugins, subscribe } from '../plugins'
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
  let name = 'api'
  let plugins = []
  if (isObj(params)) {
    if (has(params, 'pluginName')) {
      name = params.pluginName
      unset(params, 'pluginName')
    }
    if (has(params, 'plugins')) {
      plugins = params.plugins
      unset(params, 'plugins')
    }
    defineConfig(params)
  }

  subscribe('on-changed-langcode', setLang)
  subscribe('on-changed-multilang', setMultilang)
  const loadedPlugins = await loadPlugins(plugins)

  // register plugin
  return {
    install(app, options) {
      app.config.globalProperties[`$${name}`] = {
        APIVERSION,
        VERSION,
        defineConfig,
        createRequest,
        getInfo,
        getPage,
        getPages,
        createAction,
        apiCall,
      }
      app.provide(name,  app.config.globalProperties[`$${name}`])

      // add plugins, usage: $api.site or inject('api.site')
      each(loadedPlugins, (def) => {
        app.config.globalProperties[`$${name}`][def.name] = def.export
        app.provide(`${name}.${def.name}`, def.export)
      })
    }
  }
}