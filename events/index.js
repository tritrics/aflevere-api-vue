import { has, each, isStr, isFunc } from '../fnlib'

/**
 * very simple mini event bus for communication between Plugins
 */
const events = {}

/**
 * subcribe to an event
 */
export function subscribe(event, callback) {
  if (isStr(event) && isFunc(callback)) {
    if (!has(events, event)) {
      events[event] = []
    }
    events[event].push(callback)
  }
}

/**
 * dispatch an event
 */
export function publish(event, payload = null) {
   if (isStr(event) && has(events, event)) {
    each(events[event], (callback) => {
      callback(payload)
    })
   }
}