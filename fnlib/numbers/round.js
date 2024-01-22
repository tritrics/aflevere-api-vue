export default function round(val, dec) {
  const i = (dec === undefined || dec < 0) ? 1 : 10 ** dec
  return Math.round(val * i) / i
}