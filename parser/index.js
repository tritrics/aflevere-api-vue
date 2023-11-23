import { isObj } from '../fnlib'
import Parser from './Parser'
import Options from './Options'

const parserOptions = new Options()

/**
 * Create or change default options
 */
export function defineConfig() {
  parserOptions.set(...arguments)
}

export function getOption() {
  return parserOptions.get(...arguments)
}

/**
 * returning a parser factory function
 * @param {object} options 
 * @returns function
 */
export function createParser(_options) {
  if (isObj(_options)) {
    defineConfig(_options)
  }
  return (json) => {
    return new Parser().get(json)
  }
}

export { Parser }