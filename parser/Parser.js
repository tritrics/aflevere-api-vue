import { each, has, isArr, isObj } from '../fnlib'

import { createBoolean } from './fields/Boolean'
import { createBlock } from './fields/Block'
import { createCollection } from './fields/Collection'
import { createDate } from './fields/Date'
import { createDateTime } from './fields/DateTime'
import { createFile } from './fields/File'
import { createHtml } from './fields/Html'
import { createImage } from './fields/Image'
import { createLink } from './fields/Link'
import { createLanguage } from './fields/Language'
import { createLanguages } from './fields/Languages'
import { createMarkdown } from './fields/Markdown'
import { createNumber } from './fields/Number'
import { createOption } from './fields/Option'
import { createPage } from './fields/Page'
import { createSite } from './fields/Site'
import { createString } from './fields/String'
import { createText } from './fields/Text'
import { createTime } from './fields/Time'
import { createUser } from './fields/User'

const Parser = class {

  get(json) {
    if (has(json, 'body')) {
      return this.parseNodes(json.body)
    }
    return {}
  }

  parseNodes(nodes) {
    let res = {}

    // node is Object
    if (isObj(nodes)) {

      // node with type and value
      if (has(nodes, 'type') && (has(nodes, 'value') || nodes.type === 'page')) {
        return this.getField(nodes)
      }
      
      // node with value
      else if (has(nodes, 'value')) {
        return this.parseNodes(nodes.value)
      }
      res = {}
      each(nodes, (node, key) => {
        res[key] = this.parseNodes(node)
      })
      return res
    }

    // node is Array
    else if (isArr(nodes)) {
      res = []
      each(nodes, (node, key) => {
        res[key] = this.parseNodes(node)
      })
      return res
    }
    return nodes
  }

  getField(node) {
    switch(node.type) {
      case 'block':
        return createBlock(this.parseValue(node))
      case 'boolean':
        return createBoolean(node)
      case 'collection':
        return createCollection(this.parseValue(node))
      case 'date':
        return createDate(node)
      case 'datetime':
        return createDateTime(node)
      case 'email':
      case 'tel':
      case 'url':
        return createLink(node)
      case 'file':
        return createFile(this.parseValue(node))
      case 'html':
        return createHtml(node)
      case 'image':
        return createImage(this.parseValue(node))
      case 'language':
        return createLanguage(node)
      case 'languages':
        return createLanguages(this.parseValue(node))
      case 'markdown':
        return createMarkdown(node)
      case 'number':
        return createNumber(node)
      case 'option':
        return createOption(node)
      case 'page':
        return createPage(this.parseValue(node))
      case 'site':
        return createSite(this.parseValue(node))
      case 'text':
        return createText(node)
      case 'time':
        return createTime(node)
      case 'user':
        return createUser(this.parseValue(node))
      default:
        
        // also files, object, pages, structure, users, options
        if (isArr(node.value) || isObj(node.value)) {
          return this.parseNodes(node.value)
        }
        
        // also string
        else {
          return createString(node) 
        }
    }
  }

  parseValue(node) {
    if (has(node, 'value')) {
      node.value = this.parseNodes(node.value)
    }
    return node
  }
}

export default Parser