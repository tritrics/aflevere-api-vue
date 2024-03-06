/**
 * Get the HTML's document width (including invisible parts).
 * 
 * @returns {integer}
 */
export default function getDocWidth() {
  return Math.max(
    document.documentElement['clientWidth'],
    document.body['scrollWidth'],
    document.documentElement['scrollWidth'],
    document.body['offsetWidth'],
    document.documentElement['offsetWidth']
  )
}