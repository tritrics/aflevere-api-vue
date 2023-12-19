import { each, has, isArr, isObj, isStr } from '../fnlib'
import { subscribe } from '../api'
import OptionsWrapper from './Options'
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
 * Options
 */

const Options = new OptionsWrapper()

export function defineConfig(params) {
  Options.set(params, true)
}

export function getOption(path, params) {
  return Options.get(path, params)
}

export function setOption(params, reset = false) {
  Options.set(params, reset)
}

/**
 * Parser
 */

function parseNodes(nodes) {
  let res = {}

  // node is Object
  if (isObj(nodes)) {

    // node with type and value
    if (isField(nodes)) {
      return parseField(nodes)
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

function parseField(node) {
  switch(node.type) {
    case 'block':
      return createBlock(parseValue(node))
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
      return createFile(parseValue(node))
    case 'html':
      return createHtml(node)
    case 'image':
      return createImage(parseValue(node))
    case 'info':
      return createInfo(parseValue(node))
    case 'language':
      return createLanguage(node)
    case 'languages':
      return createLanguages(parseValue(node))
    case 'link':
      return createLink(node)
    case 'markdown':
      return createMarkdown(node)
    case 'page':
      return createPage(parseValue(node))
    case 'number':
      return createNumber(node)
    case 'option':
      return createOption(node)
    case 'site':
      return createSite(parseValue(node))
    case 'tel':
      return createLink(node)
    case 'text':
      return createText(node)
    case 'time':
      return createTime(node)
    case 'url':
      return createLink(node)
    case 'user':
      return createUser(parseValue(node))
    default:
      
      // also files, object, pages, structure, users, options
      if (isArr(node.value) || isObj(node.value)) {
        return parseNodes(node.value)
      }
      
      // also string
      else {
        return createString(node) 
      }
  }
}

function parseValue(node) {
  if (has(node, 'value')) {
    node.value = parseNodes(node.value)
  }
  return node
}

function isField(nodes) {
  return has(nodes, 'type') && (has(nodes, 'value') || nodes.type === 'page')
}

function isResponse(nodes) {
  return has(nodes, 'body')
}

function setLocale(locale) {
  Options.setLocale(locale)
}

export function parseResponse(json) {
  if (isResponse(json)) {
    return parseNodes(json.body)
  } else if (isField(json)) {
    return parseField(json)
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