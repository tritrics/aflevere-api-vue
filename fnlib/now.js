export default function now(baseDate = null) {
  const now = new Date()
  const date = baseDate instanceof Date ? baseDate : new Date() 
  return new Date(date.getFullYear(), date.getMonth(), date.getDate(), now.getHours(), now.getMinutes(), now.getSeconds(), 0)
}