import { ref } from 'vue'
import { isObj } from '../fn'
import { getFields } from '../api'
import { publish, subscribe, inject } from '../api/plugins'
import type { IApiPlugin, JSONObject } from '../types'

/**
 * original response data, parsed or not
 */
const data = ref<JSONObject>({})

/**
 * Init = request site.
 */
async function requestSite(): Promise<void> {
  const json = await getFields('/', { raw: true })
  if (isObj(json) && json.ok) {
    data.value = convertResponse(json)
    publish('on-changed-site', json.body)
  }
}

/**
 * Parse response, if core plugin is installed.
 */
function convertResponse(json: JSONObject): JSONObject {
  const fn = inject('core', 'convertResponse', (json: JSONObject): JSONObject => json)
  return fn(json)
}

/**
 * Plugin
 */
export function createSite(): IApiPlugin {
  return {
    name: 'site',
    init: async (): Promise<void> => {
      await requestSite()
      subscribe('on-changed-langcode', requestSite)
    },
    export: {
      data,
    }
  }
}