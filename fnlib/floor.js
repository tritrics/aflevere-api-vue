export default function floor(val, dec) {
  const i = (dec === undefined || dec < 0) ? 1 : 10 ** dec
  return Math.floor(val * i) / i
}