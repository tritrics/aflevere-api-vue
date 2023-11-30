import { trim, lower, has, isStr } from '../fnlib'
import { getInfo } from '../index.js'

let multilang = false

let count = 0

let current = null

let all = {}

async function getAll() {
  const response = await getInfo({ raw: true })
  multilang = response.body.meta.multilang
  if (multilang) {
    count = response.body.meta.languages
    all = response.body.value.languages.value
  }
}

export function getLang() {
  return current
}

export function setLang(str) {
  const lang = trim(lower(str))
  if (isStr(lang) && has(all, lang)) {
    current = lang
    console.log(all[current].meta.locale)
  }
}

export function detectLang() {
}

export async function createI18n(lang = null) {
  return async () => {
    await getAll()
    setLang(lang)
    return getLang
  }
}