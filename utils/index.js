// some simplified util functions
export const isObject = (val) => val !== null && typeof val === 'object';

export const hasOwn = (target, key) =>
  Object.prototype.hasOwnProperty.call(target, key);
