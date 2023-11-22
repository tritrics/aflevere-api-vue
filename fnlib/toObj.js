export default function toObj(base, functions, data) {
  return Object.assign(Object.create(base), functions, data)
}