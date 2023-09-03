import {
  reactive,
  ReactiveFlags,
  reactiveMap,
  shallowReactiveMap,
} from './reactive.js';

import { isObject, hasOwn } from '../utils/index.js';
import { trigger, track } from './effect.js';

const createGetter = (isShallow = false) => {
  return function get(target, key, receiver) {
    const isExistInMap = () =>
      key === ReactiveFlags.RAW &&
      (receiver === reactiveMap.get(target) ||
        receiver === shallowReactiveMap.get(target));
    if (key === ReactiveFlags.isReactive) {
      return true;
    } else if (isExistInMap()) {
      return target;
    }
    const res = Reflect.get(target, key, receiver);
    track(target, 'get', key);
    if (isObject(res)) {
      return isShallow ? res : reactive(res);
    }
    return res;
  };
};

const createSetter = () => {
  return function (target, key, val, receiver) {
    const res = Reflect.set(target, key, val, receiver);
    trigger(target, 'set', key);
    return res;
  };
};

const get = createGetter();
const set = createSetter();
const shallowReactiveGet = createGetter(true);

function has(target, key) {
  const res = Reflect.has(target, key);
  track(target, 'has', key);
  return res;
}

function deleteProperty(target, key) {
  const hadKey = hasOwn(target, key);
  const res = Reflect.deleteProperty(target, key);
  if (res && hadKey) {
    trigger(target, 'delete', key);
  }
  return res;
}

export const mutableHandlers = {
  get,
  set,
  has,
  deleteProperty,
};

export const shallowMutableHandlers = {
  shallowReactiveGet,
  set,
  has,
  deleteProperty,
};
