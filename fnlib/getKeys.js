import sanArr from './sanArr'
import inArr from './inArr'
import lower from './lower'

const controlKeys = [ 'Backspace', 'Tab', 'Enter', 'Shift', 'Escape', 'ArrowLeft', 'ArrowUp', 'ArrowRight', 'ArrowDown', 'Delete', 'Home', 'End', 'PageUp', 'PageDown' ]
const fnKeys = [ 'Alt', 'Meta', 'Control' ]

/**
 * order: meta-alt-ctrl-[key]
 * where no-input-keys are translated, @see above
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