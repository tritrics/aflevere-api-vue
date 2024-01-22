export default function uuid() {
  const time = new Date().getTime()
  const rand = Math.floor(Math.random() * 8999) + 1000
  const num = time * 1000 + rand
  return num.toString(16)
}