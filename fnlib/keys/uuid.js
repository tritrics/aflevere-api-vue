/**
 * Creates a random hexadecimal string.
 * Not very strong, but good enough for most cases and short.
 * 
 * @returns {string}
 */
export default function uuid() {
  const time = new Date().getTime()
  const rand = Math.floor(Math.random() * 8999) + 1000
  const num = time * 1000 + rand
  return num.toString(16)
}