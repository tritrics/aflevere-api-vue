import { ref } from 'vue'
import { each, trim, lower, has, isObj, toBool } from '../fnlib'
import { getInfo, hasPlugin, publish, parse } from '../api'

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

export function getData() {
  return data.value
}

/**
 */
export function getLanguage() {
  return current.value
}

/**
 */
export function getLanguages() {
  return has(data.value, '$type') ? data.value.languages : data.value.body.value.languages.value
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
  data.value = parse(json) // parse does nothing if not parser exists
  publish('on-changed-languages', getLanguages())
}

/**
 * Plugin
 */
export function createI18n(params) {
  return {
    id: 'avlevere-api-vue-i18n-plugin',
    name: 'i18n',
    init: async () => {
      await requestLanguages()
      setLanguage(null, true, true)
    },
    export: {
      isMultilang,
      isValidLanguage,
      isLanguage,
      getData,
      getLanguage,
      getDefaultLanguage,
      getUserLanguage,
      getLanguages,
      setLanguage,
    }
  }
}