import ltrim from './ltrim'
import {rtrim} from '../index'

export default function trim(val, chars = ' ') {
  return rtrim(ltrim(val, chars), chars)
}