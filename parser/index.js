import { each, has, isArr, isObj } from '../fn'
import { subscribe } from '../plugins'
import ParserOptions from './Options'
import * as models from './models'

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
      return models.createBlock(createChildModels(node))
    case 'boolean':
      return models.createBoolean(node)
    case 'color':
      return models.createColor(node)
    case 'date':
      return models.createDate(node)
    case 'datetime':
      return models.createDateTime(node)
    case 'email':
      return models.createLink(node)
    case 'file':
      return models.createFile(createChildModels(node))
    case 'html':
      return models.createHtml(node)
    case 'image':
      return models.createImage(createChildModels(node))
    case 'info':
      return models.createInfo(createChildModels(node))
    case 'language':
      return models.createLanguage(node)
    case 'languages':
      return models.createLanguages(createChildModels(node))
    case 'link':
      return models.createLink(node)
    case 'markdown':
      return models.createMarkdown(node)
    case 'page':
      return models.createPage(createChildModels(node))
    case 'number':
      return models.createNumber(node)
    case 'option':
      return models.createOption(node)
    case 'site':
      return models.createSite(createChildModels(node))
    case 'tel':
      return models.createLink(node)
    case 'text':
      return models.createText(node)
    case 'time':
      return models.createTime(node)
    case 'url':
      return models.createLink(node)
    case 'user':
      return models.createUser(createChildModels(node))
    default:
      
      // also files, object, pages, structure, users, options
      if (isArr(node.value) || isObj(node.value)) {
        return parseNodes(node.value)
      } else {
        return models.createString(node) 
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