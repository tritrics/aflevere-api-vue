import toStr from './toStr'

export default function addSlashes(val) {
  return toStr(val).
    replace(/\\/g, '\\\\').
    replace(/u0008/g, '\\b').
    replace(/\t/g, '\\t').
    replace(/\n/g, '\\n').
    replace(/\f/g, '\\f').
    replace(/\r/g, '\\r').
    replace(/'/g, '\\\'').
    replace(/"/g, '\\"')
}