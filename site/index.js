import { ref } from 'vue'
import { getPage, parse, publish, subscribe } from '../api'

/**
 * original response data, parsed or not
 */
const data = ref({})

/**
 * init / request site
 */
async function requestSite(code) {
  const json = await getPage('/', { raw: true })
  data.value = parse(json) // parse does nothing if not parser exists
  publish('on-changed-site', data)
}

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