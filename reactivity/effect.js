const targetMap = new WeakMap();
let activeEffect = null;

export function effect(fn, options = {}) {
  if (fn.effect) {
    fn = fn.effect.fn; // 如果fn本来就是effect，就获取effect的fn
  }

  const _effect = new ReactiveEffect(fn); // 构建新的effect

  if (!options || !options.lazy) {
    _effect.run();
  }

  const runner = _effect.run.bind(_effect);
  runner.effect = _effect;
  return runner;
}

class ReactiveEffect {
  deps = [];
  parent = activeEffect; // 指针，指向上一个effect
  constructor(fn) {
    this.fn = fn;
  }
  run() {
    try {
      this.parent = activeEffect; // 保存上一个activeEffect
      activeEffect = this;
      return this.fn();
    } finally {
      //cleanUpEffect(this) // 这里清空一下依赖deps，优化性能
      activeEffect = this.parent;
      this.parent = undefined;
    }
  }
}

export function track(target, type, key) {
  let depsMap = targetMap.get(target);
  if (!depsMap) {
    targetMap.set(target, (depsMap = new Map()));
  }
  let deps = depsMap.get(key);
  if (!deps) {
    deps = new Set();
  }
  if (!deps.has(activeEffect) && activeEffect) {
    deps.add(activeEffect);
  }
  depsMap.set(key, deps);
}

export function trigger(target, type, key) {
  /**
   * depsMap {
   *  deps: {
   *    key: [effect1, effect2, ...]
   *  }
   * }
   */
  const depsMap = targetMap.get(target);
  if (!depsMap) {
    return; // 没有依赖
  }
  const deps = depsMap.get(key);
  if (!deps) {
    return; // 依赖没有effect
  }
  deps.forEach((effectFn) => {
    effectFn.run();
  });
}
