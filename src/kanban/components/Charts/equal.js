import { is } from 'immutable';

function equal(old, target) {
  let r = true;
  for (const prop in old) {
    if (!is(old[prop], target[prop])) {
      r = false;
    }
  }
  for (const prop in target) {
    if (!is(old[prop], target[prop])) {
      r = false;
    }
  }
  return r;
}

export default equal;
