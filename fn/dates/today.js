/**
 * Get a Date object with date = today, where time is set to 00:00:00
 * 
 * @returns {Date}
 */
export default function today() {
  const now = new Date()
  return new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0)
}