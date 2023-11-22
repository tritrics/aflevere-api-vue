import ltrim from './ltrim'
import rtrim from './rtrim'

export default function trim(val, chars = ' ') {
  return ltrim(rtrim(val, chars), chars)
}