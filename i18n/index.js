import { ref } from 'vue'
import { each, trim, lower, has, clone, toBool } from '../fnlib'
import { getInfo, getLanguage as getLanguageRequest, publish, parse } from '../api'

/**
 * list of languages like returned from getInfo()
 */
const languages = ref({})

/**
 * details of current language like returned from getLanguage()
 */
const language = ref({})

/**
 * terms
 */
const terms = ref({})

/**
 * INTERN lookup, lang => { locale: 'de_DE', default: true }
 * needed, because languages and language can be parsed and have an unknown structure
 */
const data = ref({
  multilang: false,
  current: null,
  map: {}
})

/**
 */
export function isMultilang() {
  return data.value.multilang === true
}

/**
 */
export function isLanguage(lang) {
  return data.value.current === lang
}

/**
 */
export function isValidLanguage(lang) {
  return has(data.value.map, lang)
}

/**
 */
export function getLanguages() {
  return languages.value
}

/**
 */
export function getLanguage() {
  return language.value
}

/**
 */
export function getLangcode() {
  return data.value.current
}

/**
 */
export function getLocale() {
  return data.value.map[data.value.current].locale
}

/**
 */
export function getTerm(key) {
  return terms.value[key] || null
}

/**
 */
export function getTerms() {
  return terms.value
}

/**
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
 */
export async function setLanguage(lang, init = false) {
  if (isMultilang()) {
    let res = lower(trim(lang))
    if (isValidLanguage(res) && (res !== data.value.current || init)) {
      await requestLanguage(lang)
    }
  }
  return data.value.current
}

/**
 * request all available languages
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
 * request single language
 */
async function requestLanguage(lang) {
  if (isMultilang()) {
    const json = await getLanguageRequest(lang, { raw: true })
    data.value.current = lang
    data.value.map[data.value.current ].locale = json.body.meta.locale
    terms.value = clone(json.body.terms)
    language.value = parse(json.body)
    publish('on-changed-langcode', getLangcode())
    publish('on-changed-locale', getLocale())
    publish('on-changed-language', getLanguage())
  }
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