import { ref } from 'vue'
import { getPage } from '../api'
import { parse, publish, subscribe } from '../plugins'

/**
 * original response data, parsed or not
 */
const data = ref({})

/**
 * Init = request site.
 */
async function requestSite() {
  const json = await getPage('/', { fields: true, raw: true })
  data.value = parse(json) // parse does nothing if not parser exists
  publish('on-changed-site', data)
}

/**
 * Get site's data.
 * 
 * @returns {object}
 */
export function getData() {
  return data.value
}

/**
 * Plugin
 */
export function createSite(params) {
  return {
    id: 'avlevere-api-vue-site-plugin',
    name: 'site',
    init: async () => {
      await requestSite()
      subscribe('on-changed-langcode', requestSite)
    },
    export: {
      getData,
    }
  }
}