import { sanArr, inArr, lower } from '../index'

const controlKeys = [ 'Backspace', 'Tab', 'Enter', 'Shift', 'Escape', 'ArrowLeft', 'ArrowUp', 'ArrowRight', 'ArrowDown', 'Delete', 'Home', 'End', 'PageUp', 'PageDown' ]
const fnKeys = [ 'Alt', 'Meta', 'Control' ]

/**
 * Get information about the pressed keys.
 * Returnes a string like
 *    meta-alt-ctrl-[controlKey] OR
 *    meta-alt-ctrl-[char]
 * 
 * @param {Event} Event
 * @param {boolean} getInput get the pressed input (char) key
 * @param {boolean} getControl get control key, if pressed
 * @param {boolean} getFn get function key, if pressed
 * @param {boolean} returnArray return as array instead of string
 * @returns {string|array}
 */
export default function getKeys(Event, getInput = true, getControl = true, getFn = true, returnArray = false) {
  const keys = []
  if (getFn) {
    if (Event.metaKey) {
      keys.push('meta')
    }
    if (Event.altKey) {
      keys.push('alt')
    }
    if (Event.ctrlKey) {
      keys.push('ctrl')
    }
  }
  if (Event.key && !inArr(Event.key, fnKeys)) {
    if (inArr(Event.key, controlKeys)) {
      if (getControl) {
        keys.push(lower(Event.key))
      }
    } else if (getInput) {
      keys.push(Event.key)
    }
  }
  return returnArray ? sanArr(keys) : sanArr(keys).join('-')
}