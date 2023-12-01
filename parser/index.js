import { each, has, isArr, isObj, isStr } from '../fnlib'
import { subscribe } from '../events'
import OptionsWrapper from './Options'
import { createBoolean } from './models/Boolean'
import { createBlock } from './models/Block'
import { createDate } from './models/Date'
import { createDateTime } from './models/DateTime'
import { createFile } from './models/File'
import { createHtml } from './models/Html'
import { createImage } from './models/Image'
import { createInfo } from './models/Info'
import { createLink } from './models/Link'
import { createLanguage } from './models/Language'
import { createLanguages } from './models/Languages'
import { createMarkdown } from './models/Markdown'
import { createNodes } from './models/Nodes'
import { createNumber } from './models/Number'
import { createOption } from './models/Option'
import { createPage } from './models/Page'
import { createSite } from './models/Site'
import { createString } from './models/String'
import { createText } from './models/Text'
import { createTime } from './models/Time'
import { createUser } from './models/User'

export let Options = new OptionsWrapper()

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
    case 'nodes':
      return createNodes(parseValue(node))
    case 'date':
      return createDate(node)
    case 'datetime':
      return createDateTime(node)
    case 'email':
    case 'tel':
    case 'url':
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
    case 'markdown':
      return createMarkdown(node)
    case 'number':
      return createNumber(node)
    case 'option':
      return createOption(node)
    case 'page':
      return createPage(parseValue(node))
    case 'site':
      return createSite(parseValue(node))
    case 'text':
      return createText(node)
    case 'time':
      return createTime(node)
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

/**
 * is parsable field
 */
function isField(nodes) {
  return has(nodes, 'type') && (has(nodes, 'value') || nodes.type === 'page')
}

/**
 * is parsable (complete) response
 */
function isResponse(nodes) {
  return has(nodes, 'body')
}

/**
 * Create or change default options
 */
export function defineConfig() {
  Options.set(...arguments)
}

export function getOption() {
  return Options.get(...arguments)
}

export function parseResponse(json) {
  if (isResponse(json)) {
    return parseNodes(json.body)
  } else if (isField(json)) {
    return parseField(json)
  }
  return {}
}

export function setLocale(locale) {
  if(isStr(locale) && /^[a-z]{2,}[-]{1,}[A-Z]{2,}$/.test(locale)) {
    Options.set({ global: { locale: locale }})
  }
}

/**
 * Returning the plugin factory function
 */
export function createParser(options) {
  return () => {
    if (isObj(options)) {
      defineConfig(options)
    }
    subscribe('on-changed-locale', setLocale)
    return parseResponse
  }
}