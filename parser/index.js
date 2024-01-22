import { each, has, isArr, isObj } from '../fnlib'
import { subscribe } from '../api'
import ParserOptions from './Options'
import { createBoolean } from './models/Boolean'
import { createBlock } from './models/Block'
import { createColor } from './models/Color'
import { createDate } from './models/Date'
import { createDateTime } from './models/DateTime'
import { createFile } from './models/File'
import { createHtml } from './models/Html'
import { createImage } from './models/Image'
import { createInfo } from './models/Info'
import { createLanguage } from './models/Language'
import { createLanguages } from './models/Languages'
import { createLink } from './models/Link'
import { createMarkdown } from './models/Markdown'
import { createPage } from './models/Page'
import { createNumber } from './models/Number'
import { createOption } from './models/Option'
import { createSite } from './models/Site'
import { createString } from './models/String'
import { createText } from './models/Text'
import { createTime } from './models/Time'
import { createUser } from './models/User'

/**
 * Instance of Options
 */
const Options = new ParserOptions()

/**
 * Define/set config/options
 * 
 * @param {object} params 
 */
export function defineConfig(params) {
  Options.set(params, true)
}

/**
 * Get as subnode of Options determined by dot-separated path.
 * Example: `link.router`
 * 
 * @param {string} path a dot-separated path
 * @param {object} params the user-given options which amends or overrides the returned value
 * @returns {mixed}
 */
export function getOption(path, params) {
  return Options.get(path, params)
}

/**
 * Setting or resetting all options at once.
 * Intern defaults are used if a node is not given.
 * 
 * @param {object} params the options to save
 * @param {boolean} reset replace instead of amend existing options
 */
export function setOption(params, reset = false) {
  Options.set(params, reset)
}

/**
 * Recoursive function to parse the response from Kirby
 * 
 * @param {mixed} nodes 
 * @returns {object}
 */
function parseNodes(nodes) {
  let res = {}

  // node is Object
  if (isObj(nodes)) {

    // node with type and value
    if (isField(nodes)) {
      return createModel(nodes)
    }
    
    // node with value
    else if (has(nodes, 'value')) {
      return parseNodes(nodes.value)
    }
    res = {}
    each(nodes, (node, key) => {
      res[key] = parseNodes(node)
    })
    return res
  }

  // node is Array
  else if (isArr(nodes)) {
    res = []
    each(nodes, (node, key) => {
      res[key] = parseNodes(node)
    })
    return res
  }
  return nodes
}

/**
 * Model factory
 * Sub-method of parseNodes() creating the model for a given field.
 * 
 * @param {object} node
 * @returns {object}
 */
function createModel(node) {
  switch(node.type) {
    case 'block':
      return createBlock(createChildModels(node))
    case 'boolean':
      return createBoolean(node)
    case 'color':
      return createColor(node)
    case 'date':
      return createDate(node)
    case 'datetime':
      return createDateTime(node)
    case 'email':
      return createLink(node)
    case 'file':
      return createFile(createChildModels(node))
    case 'html':
      return createHtml(node)
    case 'image':
      return createImage(createChildModels(node))
    case 'info':
      return createInfo(createChildModels(node))
    case 'language':
      return createLanguage(node)
    case 'languages':
      return createLanguages(createChildModels(node))
    case 'link':
      return createLink(node)
    case 'markdown':
      return createMarkdown(node)
    case 'page':
      return createPage(createChildModels(node))
    case 'number':
      return createNumber(node)
    case 'option':
      return createOption(node)
    case 'site':
      return createSite(createChildModels(node))
    case 'tel':
      return createLink(node)
    case 'text':
      return createText(node)
    case 'time':
      return createTime(node)
    case 'url':
      return createLink(node)
    case 'user':
      return createUser(createChildModels(node))
    default:
      
      // also files, object, pages, structure, users, options
      if (isArr(node.value) || isObj(node.value)) {
        return parseNodes(node.value)
      } else {
        return createString(node) 
      }
  }
}

/**
 * Create models, when a field has multiple child fields in node `value`.
 * 
 * @param {object} node 
 * @returns {object}
 */
function createChildModels(node) {
  if (has(node, 'value')) {
    node.value = parseNodes(node.value)
  }
  return node
}

/**
 * Check, if a node is field.
 * This is the case when it has subnodes `type` and `value` or is of type `page`.
 * 
 * @param {object} node
 * @returns {boolean}
 */
function isField(node) {
  return has(node, 'type') && (has(node, 'value') || node.type === 'page')
}

/**
 * Change locale in Options.
 * 
 * @param {string} locale 
 */
function setLocale(locale) {
  Options.setLocale(locale)
}

/**
 * Main function to parse json from response.
 * 
 * @param {object} json 
 * @returns {object}
 */
export function parseResponse(json) {
  if ( has(json, 'body')) {
    return parseNodes(json.body)
  } else if (isField(json)) {
    return createModel(json)
  }
  return {}
}

/**
 * Plugin
 */
export function createParser(params) {
  defineConfig(params)
  return {
    id: 'avlevere-api-vue-parser-plugin',
    name: 'parser',
    init: () => {
      subscribe('on-changed-locale', setLocale)
    },
    parse: parseResponse,
    export: {
      defineConfig,
      getOption,
      setOption,
      parseResponse,
    }
  }
}