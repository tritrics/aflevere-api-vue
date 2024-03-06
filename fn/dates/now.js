/**
 * Get a Date object with date = today and time = now.
 * Optionally the date is taken from a given baseDate.
 * 
 * @param {Date} baseDate 
 * @returns {Date}
 */
export default function now(baseDate = null) {
  const now = new Date()
  const date = baseDate instanceof Date ? baseDate : new Date() 
  return new Date(date.getFullYear(), date.getMonth(), date.getDate(), now.getHours(), now.getMinutes(), now.getSeconds(), 0)
}