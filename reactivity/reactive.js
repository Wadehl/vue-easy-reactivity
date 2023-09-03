import { isObject } from '../utils/index.js'; //一些简化的工具函数
import { mutableHandlers, shallowMutableHandlers } from './baseHandlers.js'; // proxy handlers

export const ReactiveFlags = {
  isReactive: '__v_isReactive', // reactive的标识符
  RAW: '__v_isRaw',
};

export const reactiveMap = new WeakMap();
export const shallowReactiveMap = new WeakMap();
// reactive，shallowReactive的缓存

export function reactive(target) {
  return createReactiveObject(target, mutableHandlers, reactiveMap);
}

export function shallowReactive(target) {
  return createReactiveObject(
    target,
    shallowMutableHandlers,
    shallowReactiveMap
  );
}

export function isReactive(target) {
  return !!target[ReactiveFlags.isReactive];
}

function createReactiveObject(target, proxyHandlers, proxyMap) {
  if (!isObject(target)) {
    return target;
  }
  const existingProxy = proxyMap.get(target);
  if (existingProxy) {
    // 缓存里有直接返回
    return existingProxy;
  }

  const proxy = new Proxy(target, proxyHandlers);
  proxyMap.set(target, proxy);

  return proxy;
}
