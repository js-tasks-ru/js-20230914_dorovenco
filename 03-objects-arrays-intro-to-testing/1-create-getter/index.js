/**
 * createGetter - creates function getter which allows select value from object
 * @param {string} path - the strings path separated by dot
 * @returns {function} - function-getter which allow get value from object by set path
 */
export const createGetter = path => {
  const pathKeys = path.split(".");
  return function walk(obj) {
    let currentObject = obj;
    for (let pathKey of pathKeys) {
      if (!(pathKey in currentObject)) {
        return;
      } currentObject = currentObject[pathKey];
    }
    return currentObject;
  }
};
