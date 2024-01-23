/**
 * Converts a number to string and adds 0 to the beginning until the requested length.
 * 
 * @param {float} val 
 * @param {integer} places 
 * @returns {string}
 */
export default function pad(val, places) {
  const zero = places - val.toString().length + 1;
  return Array(+(zero > 0 && zero)).join('0') + val;
}