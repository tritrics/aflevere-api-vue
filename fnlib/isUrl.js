import isStr from './isStr'

export default function isUrl(val) {
  try { 
    return isStr(val) && Boolean(new URL(val))
  } catch(e) { 
    return false;
  }
}