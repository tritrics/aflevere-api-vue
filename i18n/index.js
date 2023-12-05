import { ref } from 'vue'
import { each, trim, lower, has, isObj, toBool } from '../fnlib'
import { getInfo, Options, publish, getPluginName } from '../api'

/**
 * multilang sites have at least one language and the Kirby config
 * "languages" is true.
 */
const multilang = ref(false)

/**
 * urrent selected lang
 */
const current = ref(null)

/**
 * original response data, parsed or not
 */
const data = ref({})

/**
 * INTERN lookup, lang => { locale: 'de_DE', default: true }
 */
const langMap = {}

/**
 */
export function isMultilang() {
  return multilang.value === true
}

/**
 */
export function isLanguage(lang) {
  return current.value === lang
}

/**
 */
export function isValidLanguage(lang) {
  return has(langMap, lang)
}

/**
 */
export function getLanguage() {
  return current.value
}

/**
 */
export function getLanguages() {
  if (Options.hasParser()) {
    return data.value.languages
  } else {
    return data.value.body.value.languages.value
  }
}

/**
 */
export function getDefaultLanguage() {
  for (let lang in langMap) {
    if (langMap[lang].default) {
      return lang
    }
  }
  return null
}

/**
 */
export function getUserLanguage() {
  for (let i = 0; i < navigator.languages.length; i++) {
    let lang = navigator.languages[i].toLowerCase().split('-').shift()
    if (isValidLanguage(lang)) {
      return lang
    }
  }
  return null
}

/**
 * Language setter, can also autodetect language, if flags are given
 * 
 * Language detection doesn't analyse the url, this must be done
 * in the router and eventuelly the router overrides the detected
 * language using isValid() and setLanguage().
 * 
 * Method detects the preferred/fallback language from:
 * 
 * 1. given with options createI18n(lang)
 * 2. detected from browser
 * 3. default language from Kirby
 * 
 * @param string lang
 * @param boolean getUser (from Browser)
 * @param boolean getDefault
 * @return string
 */
export function setLanguage(lang, getUser = false, getDefault = false) {
  if (!multilang.value || (lang === current.value && isValidLanguage(lang))) {
    return current.value
  }
  let res = lower(trim(lang))
  if (getUser && !isValidLanguage(res)) {
    res = getUserLanguage()
  }
  if (getDefault && !isValidLanguage(res)) {
    res = getDefaultLanguage()
  }
  if (isValidLanguage(res)) {
    current.value = res
    publish('on-changed-lang', current.value)
    publish('on-changed-locale', langMap[current.value].locale)
  }
  return current.value
}

/**
 * init / request languages
 */
async function requestLanguages() {
  const json = await getInfo({ raw: true })
  multilang.value = toBool(json.body.meta.multilang)
  if (multilang.value) {
    each(json.body.value.languages.value, (props, lang) => {
      langMap[lang] = {
        locale: props.meta.locale,
        default: toBool(props.meta.default)
      }
    })
  }
  if (Options.hasParser()) {
    data.value = Options.parser(json)
  } else {
    data.value = json
  }
}

/**
 * Returning the plugin factory function
 */
export async function createI18n(params, namespace) {
  const pluginName = getPluginName(params, 'i18n')

  // request all languages and set default
  await requestLanguages()
  setLanguage(null, true, true)

  // register Plugin
  return {
    install(app, options) {
      app.config.globalProperties[`$${pluginName}`] = {
        isMultilang,
        isValidLanguage,
        isLanguage,
        getLanguage,
        getDefaultLanguage,
        getUserLanguage,
        getLanguages,
        setLanguage,
        infoData: data,
      }
      app.provide(pluginName, app.config.globalProperties[`$${pluginName}`])
    }
  }
}