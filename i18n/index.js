import { ref } from 'vue'
import { each, trim, lower, has, clone, toBool, isStr } from '../fn'
import { getInfo, getLanguage as getLanguageRequest, publish, parse } from '../api'

/**
 * list of languages like returned from getInfo()
 */
const languages = ref({})

/**
 * Details of current language like returned from getLanguage()
 */
const language = ref({})

/**
 * Terms as (optionally) defined in Kirby's language settings.
 */
const terms = ref({})

/**
 * INTERN lookup.
 * Needed, because languages and language may be parsed and have an unknown structure.
 */
const data = ref({
  multilang: false,
  current: null,
  map: {}
})

/**
 * Is it a multilanguage site or not.
 * 
 * @returns {boolean}
 */
export function isMultilang() {
  return data.value.multilang === true
}

/**
 * Check, if the given language is the current language.
 * 
 * @param {string} lang 
 * @returns {boolean}
 */
export function isLanguage(lang) {
  return data.value.current === lang
}

/**
 * Check, if the given language is valid.
 * 
 * @param {string} lang 
 * @returns {boolean}
 */
export function isValidLanguage(lang) {
  return has(data.value.map, lang)
}

/**
 * Get list with all languages.
 * 
 * @returns {object}
 */
export function getLanguages() {
  return languages.value
}

/**
 * Get object with all information from the current language.
 * 
 * @returns {object}
 */
export function getLanguage() {
  return language.value
}

/**
 * Get the current 2-chars language code.
 * 
 * @returns {string}
 */
export function getLangcode() {
  return data.value.current
}

/**
 * Get locale of current language.
 * 
 * @returns {string}
 */
export function getLocale() {
  return data.value.map[data.value.current].locale
}

/**
 * Get a term given by key.
 * 
 * @param {string} key 
 * @returns {string}
 */
export function getTerm(key) {
  return terms.value[key] || null
}

/**
 * Get all terms.
 * 
 * @returns {object}
 */
export function getTerms() {
  return terms.value
}

/**
 * Detect the best valid language from browser or settings.
 * 
 * @param {boolean} getUser try to get the language from browser
 * @param {boolean} getDefault get default language like defined in Kirby if detection fails
 * @returns {string}
 */
export function detectLanguage(getUser = true, getDefault = true) {
  let res = null
  if (getUser) {
    for (let i = 0; i < navigator.languages.length; i++) {
      let lang = navigator.languages[i].toLowerCase().split('-').shift()
      if (isValidLanguage(lang)) {
        res = lang
        break
      }
    }
  }
  if (getDefault && !isValidLanguage(res)) {
    for (let lang in data.value.map) {
      if (data.value.map[lang].default) {
        res = lang
        break
      }
    }
  }
  return res
}

/**
 * Setting a language with implicit requesting all language data from Kirby.
 * 
 * @param {string} lang 2-chars language code
 * @returns {string}
 */
export async function setLanguage(lang) {
  if (isMultilang()) {
    let res = lower(trim(lang))
    if (isValidLanguage(res) && (res !== data.value.current)) {
      await requestLanguage(lang)
    }
  }
  return data.value.current
}

/**
 * Request all available languages.
 */
async function requestLanguages() {
  const json = await getInfo({ raw: true })
  data.value.multilang = toBool(json.body.meta.multilang)
  if (isMultilang()) {
    each(json.body.value.languages.value, (props) => {
      data.value.map[props.meta.code] = {
        default: toBool(props.meta.default),
      }
    })
    languages.value = parse(json.body.value.languages) // parse does nothing if not parser exists
  } else {
     data.value.map = {}
  }
  publish('on-changed-multilang', data.value.multilang)
  if (isMultilang()) {
    publish('on-changed-languages', getLanguages())
  }
}

/**
 * Request a single language.
 */
async function requestLanguage(lang) {
  if (isMultilang()) {
    const json = await getLanguageRequest(lang, { raw: true })
    data.value.current = lang
    data.value.map[data.value.current].locale = normalizeLocale(json.body.meta.locale)
    terms.value = clone(json.body.terms)
    language.value = parse(json.body)
    publish('on-changed-langcode', getLangcode())
    publish('on-changed-locale', getLocale())
    publish('on-changed-language', getLanguage())
  }
}

/**
 * Check and convert to javascript locale format.
 * 
 * @param {string} locale 
 * @returns {string}
 */
function normalizeLocale(locale) {
  if (isStr(locale)) {
    if(/^[a-z]{2,}[_]{1,}[A-Z]{2,}$/.test(locale)) {
      locale = locale.replace('_', '-')
    }
    if(/^[a-z]{2,}[-]{1,}[A-Z]{2,}$/.test(locale)) {
      return locale
    }
  }
  return 'en-US'
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
      const detected = detectLanguage()
      await setLanguage(detected)
    },
    export: {
      detectLanguage,
      getLangcode,
      getLanguage,
      getLanguages,
      getLocale,
      isMultilang,
      isLanguage,
      isValidLanguage,
      setLanguage,
      getTerm,
      getTerms,
    }
  }
}