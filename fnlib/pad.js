export default function pad(val, places) {
  const zero = places - val.toString().length + 1;
  return Array(+(zero > 0 && zero)).join('0') + val;
}