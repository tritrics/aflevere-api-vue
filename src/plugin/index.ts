import { unset, each } from '../fn'
import AddonStore from './classes/AddonStore'
import BaseStore from './classes/BaseStore'
import UserStore from './classes/UserStore'
import GlobalStore from './classes/GlobalStore'
import Request from './classes/Request'
import { loadAddons, inject } from './modules/addons'
import { call, getFile, getFiles, getInfo, getLanguage, getPage, getPages, postCreate } from './modules/api'
import { stores } from './modules/stores'
import { version as VERSION } from '../../package.json'
import type { IApiOptions, IApiAddon, IGlobalStore, IAddonStore } from '../types'

/**
 * The API interface version.
 * Same as defined in Kirby-Plugin and required for all requests.
 */
const APIVERSION: string = 'v1'

/**
 * The user options store. Initialized before all other stores.
 */
let optionsStore: IAddonStore

/**
 * The global store. Initialized before all other stores.
 */
let globalStore: IGlobalStore

/** 
 * Plugin factory
 */
export async function createApi(options: IApiOptions) {
  const addonFns: Function[] = options.addons ?? []
  unset(options, 'addons')
  optionsStore = new AddonStore(options)
  stores('options', optionsStore)
  globalStore = new GlobalStore()
  stores('global', globalStore)
  const addons: IApiAddon[] = await loadAddons(addonFns)
  
  // register plugin
  return {
    install: async (app: any) => {
      app.config.globalProperties['$api'] = {
        APIVERSION,
        VERSION,
        store: globalStore,
        options: optionsStore,
        stores,
        call,
        getFile,
        getFiles,
        getInfo,
        getLanguage,
        getPage,
        getPages,
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
  optionsStore,
  stores,
  call,
  getFile,
  getFiles,
  getInfo,
  getLanguage,
  getPage,
  getPages,
  postCreate,
  AddonStore,
  BaseStore,
  UserStore,
  Request,
  inject
}