import { each, trim, lower, has, isStr, toBool } from '../fnlib'
import { getInfo, Options } from '../api'
import { publish } from '../events'

/**
 * multilang sites have at least one language and the Kirby config
 * "languages" is true.
 */
let multilang = false

/**
 * urrent selected lang
 */
let current = null

/**
 * lookup, lang => { locale: 'de_DE', default: true }
 */
const langMap = {}

/**
 * for export
 */
export let languages = {}

/**
 * init / request languages
 */
async function getAll() {
  const json = await getInfo({ raw: true })
  multilang = json.body.meta.multilang
  if (!multilang) {
    return
  }
  each(json.body.value.languages.value, (props, lang) => {
    langMap[lang] = {
      locale: props.meta.locale,
      default: toBool(props.meta.default)
    }
  })

  // store language node for export, no intern use
  // either parsed or not
  if (Options.hasParser()) {
    languages = Options.parser(json.body.value.languages)
  } else {
    languages = json.body.value.languages.value
  }
}

function getUserLang() {
  const languages = navigator.languages
  for (let i = 0; i < languages.length; i++) {
    let lang = languages[i].toLowerCase().split('-').shift()
    if (isValid(lang)) {
      return lang
    }
  }
  return null
}

function getDefaultLang() {
  for (let lang in langMap) {
    if (langMap[lang].default) {
      return lang
    }
  }
  return null
}

export function isMultilang() {
  return multilang
}

export function getLang() {
  return current
}

/**
 * Language setter, can also autodetect language, if flags are given
 * 
 * Language detection doesn't analyse the url, this must be done
 * in the router and eventuelly the router overrides the detected
 * language using isValid() and setLang().
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
export function setLang(lang, getUser = false, getDefault = false) {
  if (!multilang || (lang === current && isValid(lang))) {
    return current
  }
  let res = lower(trim(lang))
  if (getUser && !isValid(res)) {
    res = getUserLang()
  }
  if (getDefault && !isValid(res)) {
    res = getDefaultLang()
  }
  if (isValid(res)) {
    current = res
    publish('on-changed-lang', current)
    publish('on-changed-locale', langMap[current].locale)
  }
  return current
}

export function isValid(lang) {
  return has(langMap, lang)
}

/**
 * Returning the plugin factory function
 */
export async function createI18n(lang = null) {
  return async () => {
    await getAll()
    setLang(lang, true, true)
    return getLang
  }
}