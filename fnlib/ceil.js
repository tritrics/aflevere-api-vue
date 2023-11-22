import toFloat from './toFloat'

export default function ceil(val, dec) {
  const i = (dec === undefined || dec < 0) ? 1 : 10 ** dec
  return Math.ceil(toFloat(val) * i) / i
}