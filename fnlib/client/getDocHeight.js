/**
 * Get the HTML's document height (including invisible parts).
 * 
 * @returns {integer}
 */
export default function getDocHeight() {
  return Math.max(
    document.documentElement['clientHeight'],
    document.body['scrollHeight'],
    document.documentElement['scrollHeight'],
    document.body['offsetHeight'],
    document.documentElement['offsetHeight']
  )
}