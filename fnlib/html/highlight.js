import { extend, clone, isStr, isBool, isNull } from '../index'

/**
 * Default style
 * 
 * {object}
 */
const defaultColors = {
  number:  'darkorange',
  string:  'green',
  boolean: 'blue',
  null:    'magenta',
  key:     'red',
}

/**
 * RegEx to parse code
 * from https://github.com/highlightjs/highlight.js
 * {reg}
 */
const reg = /("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g

/**
 * Helper function which adds styles to a code-snippet
 * 
 * @param {string} match 
 * @param {object} colors 
 * @returns {string}
 */
function colorize(match, colors) {
  let color = colors.number
  if (/^"/.test(match)) {
    if (/:$/.test(match)) {
      color = colors.key
    } else {
      color = colors.string
      match = match.replace(/\\"/g, '"')
    }
  } else if (isBool(match, false)) {
    color = colors.boolean
  } else if (isNull(match)) {
    color = colors.null
  }
  return `<span style="color:${color}">${match}</span>`
}

/**
 * Highlight code
 * 
 * @param {string} str 
 * @param {object} colors optionally set colors @see defaultColors
 * @returns {string}
 */
export default function highlight(str, colors) {
  if (isStr(str)) {
    colors = extend(clone(defaultColors), colors)
    return str.replace(reg, (match) => colorize(match, colors))
  }
  return ''
}