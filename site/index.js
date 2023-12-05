import { ref } from 'vue'
import { each, trim, lower, has, isObj, toBool } from '../fnlib'
import { getNode, Options, subscribe, getPluginName } from '../api'

/**
 * original response data, parsed or not
 */
const data = ref({})

/**
 * init / request site
 */
async function requestSite() {
  const json = await getNode('/', { raw: true })
  if (Options.hasParser()) {
    data.value = Options.parser(json)
  } else {
    data.value = json
  }
}

export async function createSite(params) {
  const pluginName = getPluginName(params, 'site')
  subscribe('on-changed-lang', requestSite)
  await requestSite()

  // register Plugin
  return {
    install(app, options) {
      app.config.globalProperties[`$${pluginName}`] = {
        siteData: data,
      }
      app.provide(pluginName, app.config.globalProperties[`$${pluginName}`])
    }
  }
}