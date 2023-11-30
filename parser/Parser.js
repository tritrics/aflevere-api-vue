import { each, has, isArr, isObj } from '../fnlib'

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
      case 'nodes':
        return createNodes(this.parseValue(node))
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
      case 'info':
        return createInfo(this.parseValue(node))
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