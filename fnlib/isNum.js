export default function isNum(val, min = null, max = null, boundariesIncluded = true) {
  if (typeof val !== 'number' || !Number.isFinite(val)) {
    return false
  }
  const i = isNum(min) ? min : val - 1
  const h = isNum(max) ? max : val + 1
  if (boundariesIncluded) {
    return (val >= i && val <= h)
  }
  return (val > i && val < h)
}