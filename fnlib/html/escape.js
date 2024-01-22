import { toStr } from '../index'

const map = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#039;',
}

/**
 * opposite of php's addslashes
 */
export default function escape(val) {
  let str = toStr(val)
  return str.replace(/[&<>"']/g, (m) => map[m])
}