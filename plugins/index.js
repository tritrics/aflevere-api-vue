import { isStr, isFunc, has, inArr, isObj } from '../fn'
import { createImages } from '../images'

/**
 * Registered plugins as given with createApi(params)
 * Plugins here mean: Plugins of the API-Plugin.
 */
const registeredPlugins = []

/**
 * Simple and basic event bus for communication between Plugins.
 */
const registeredEvents = {}

/**
 * Default parser function doing nothing.
 * Function is replaced by the parser-plugin.
 * 
 * @param {object} json 
 * @returns {object}
 */
export let parse = (json) => json 

/**
 * Add a plugin.
 * 
 * @param {string} name 
 * @returns {boolean}
 */
function addPlugin(name) {
  registeredPlugins.push(name)
}

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
 * Load Plugins
 */
export async function loadPlugins(plugins) {
  const pluginsPlugin = {
    id: 'avlevere-api-vue-plugins-plugin',
    name: 'plugins',
    export: {
      parse,
      hasPlugin,
      subscribe,
      publish,
    }
  }

  // sort plugins
  // reserved positions:
  // 0: plugins (this)
  // 1: images
  // 2: parser
  // 3: i18n
  // 4: site
  // the rest is user-defined and added in the given order
  let registered = [pluginsPlugin, createImages(), null, null, null]
  for (let i = 0; i < plugins.length; i++) {
    if (!isObj(plugins[i]) || !has(plugins[i], 'name') || !has(plugins[i], 'export')) {
      continue
    }
    switch(plugins[i].id) {
      case 'avlevere-api-vue-parser-plugin':
        registered[2] = plugins[i]
        break
      case 'avlevere-api-vue-i18n-plugin':
        registered[3] = plugins[i]
        break
      case 'avlevere-api-vue-site-plugin':
        registered[4] = plugins[i]
        break
      default:
        registered.push(plugins[i])
    }
  }
  for (let j = 0; j < registered.length; j++) {
    if (has(registered[j], 'init')) {
      await registered[j].init()
    }
    if (has(registered[j], 'parse')) {
      parse = registered[j].parse
    }
    addPlugin(registered[j].name)
  }
  return registered
}