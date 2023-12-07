import { ref } from 'vue'
import { each, trim, lower, has, isStr, toBool } from '../fnlib'
import { getInfo, publish, parse } from '../api'

/**
 * multilang sites have at least one language and the Kirby config
 * "languages" is true.
 */
const multilang = ref(null)

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
let langMap = {}

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
    for (let lang in langMap) {
      if (langMap[lang].default) {
        res = lang
        break
      }
    }
  }
  return res
}

/**
 */
export function setLanguage(lang) {
  if (isMultilang()) {
    let res = lower(trim(lang))
    if (isValidLanguage(res) && (res !== current.value || init)) {
      current.value = res
      publish('on-changed-lang', current.value)
      publish('on-changed-locale', langMap[current.value].locale)
    }
  }
  return current.language
}

/**
 * init / request languages
 */
async function requestLanguages() {
  const json = await getInfo({ raw: true })
  multilang.value = toBool(json.body.meta.multilang)
  if (isMultilang()) {
    each(json.body.value.languages.value, (props, lang) => {
      langMap[lang] = {
        locale: props.meta.locale,
        default: toBool(props.meta.default)
      }
    })
  } else {
    langMap = {}
  }
  data.value = parse(json) // parse does nothing if not parser exists
  publish('on-changed-multilang', multilang.value)
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
      const detected = detectLanguage()
      setLanguage(detected)
    },
    export: {
      isMultilang,
      isValidLanguage,
      isLanguage,
      getData,
      getLanguage,
      getLanguages,
      setLanguage,
      detectLanguage,
    }
  }
}