/**
 * Wait for given milliseconds
 * 
 * @param {int} ms 
 * @returns 
 */
export default async function wait(ms = 0) {
  return new Promise(resolve => setTimeout(resolve, ms))
}