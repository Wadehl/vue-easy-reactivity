import { isObject } from '../utils/index.js';
import { track, trigger } from './effect.js';
import { reactive } from './reactive.js';

export function ref(val) {
  return createRef(val);
}

export function createRef(val) {
  if (isRef(val)) {
    return val;
  }
  return new RefImpl(val);
}

export function isRef(val) {
  return !!(val.__v_isRef && val);
}

class RefImpl {
  constructor(val) {
    this.__v_isRef = true;
    this._val = convert(val);
  }
  get value() {
    track(this, 'get', 'value');
    return this._val;
  }
  set value(newVal) {
    trigger(this, 'set', 'value');
    this._val = convert(newVal);
  }
}

const convert = (val) => {
  return isObject(val) ? reactive(val) : val;
};
