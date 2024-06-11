import { unset, each } from '../fn'
import BaseStore from './classes/BaseStore'
import GlobalStore from './classes/GlobalStore'
import Request from './classes/Request'
import { loadAddons, inject } from './modules/addons'
import { call, getFile, getFiles, getInfo, getLanguage, getPage, getPages, getSite, postCreate } from './modules/api'
import { stores } from './modules/stores'
import { version as VERSION } from '../../package.json'
import type { IApiOptions, IApiAddon, IGlobalStore } from '../types'

/**
 * The API interface version.
 * Same as defined in Kirby-Plugin and required for all requests.
 */
const APIVERSION: string = 'v1'

/**
 * The global store. Initialized before all other stores.
 */
const globalStore: IGlobalStore = new GlobalStore()

/** 
 * Plugin factory
 */
export async function createApi(options: IApiOptions) {
  const load: IApiAddon[] = options.addons ?? []
  unset(options, 'addons')
  globalStore.init(options)
  stores('global', globalStore)
  const addons: IApiAddon[] = await loadAddons(load.flat())
  
  // register plugin
  return {
    install: async (app: any) => {
      app.config.globalProperties['$api'] = {
        APIVERSION,
        VERSION,
        store: globalStore,
        stores,
        call,
        getFile,
        getFiles,
        getInfo,
        getLanguage,
        getPage,
        getPages,
        getSite,
        postCreate
      }
      app.provide('api',  app.config.globalProperties['$api'])
      // app.provide('api.app', app)
      each(addons, (addon: IApiAddon) => {
        app.config.globalProperties['$api'][addon.name] = addon.export
        app.provide(`api.${addon.name}`, addon.export)
        each(addon?.components, (component: any, name: string) => {
          app.component(name, component)
        })
      })
    }
  }
}

/**
 * Export module
 */
export {
  APIVERSION,
  VERSION,
  globalStore,
  stores,
  call,
  getFile,
  getFiles,
  getInfo,
  getLanguage,
  getPage,
  getPages,
  getSite,
  postCreate,
  BaseStore,
  Request,
  inject
}