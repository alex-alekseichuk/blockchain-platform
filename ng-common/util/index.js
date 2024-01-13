/**
 * Pure common utilities functions.
 * It can be just imported/required w/o IoC/DI,
 * because it has no dependencies.
 * @requires uuid/v4
 */
'use strict';

const delay = miliseconds =>
  new Promise(resolve => setTimeout(resolve, miliseconds));

const promiseProps = async object => {
  if (object instanceof Object) {
    return Object.assign({}, ...(await Promise.all(
      Object.entries(object).map(async ([key, value]) => ({[key]: await value}))
    )));
  }
  return null;
};

const promiseEach = async (iterable, func) => {
  for (let i in iterable) {
    if (iterable.hasOwnProperty(i)) {
      await func(iterable[i], i);
    }
  }
};

const promiseMap = async (iterable, func) => {
  const results = [];
  for (let i in iterable) {
    if (iterable.hasOwnProperty(i)) {
      results.push(await func(iterable[i], i));
    }
  }
  return results;
};

/**
 * Get arguments names of the function.
 * @param {function} func - target function
 * @return {Array} arrays of args names
 */
function getFuncArgs(func) {
  let str = func.toString();

  // Remove comments of the form /* ... */
  // Removing comments of the form //
  // Remove body of the function { ... }
  // removing '=>' if func is arrow function
  str = str.replace(RegExp('\\/\\*[\\s\\S]*?\\*\\/', 'g'), '')
    .replace(RegExp('\\/\\/(.)*', 'g'), '')
    .replace(RegExp('{[\\s\\S]*}'), '')
    .replace(RegExp('=>', 'g'), '')
    .trim();

  // Start parameter names after first '('
  const start = str.indexOf("(") + 1;

  // End parameter names is just before last ')'
  const end = str.length - 1;

  const result = str.substring(start, end).split(",");

  const params = [];

  result.forEach(element => {
    // Removing any default value
    element = element.replace(RegExp('=[\\s\\S]*', 'g'), '').trim();

    if (element.length > 0)
      params.push(element);
  });

  return params;
}

/**
 *
 * @param {object|function} obj object of function to check if it's a promise
 * @return {boolean}
 */
function isPromise(obj) {
  return !!obj && (typeof obj === 'object' || typeof obj === 'function') && typeof obj.then === 'function';
}

/**
 * Create enum object from the array of labels (items).
 * @param labels
 * @returns {object} enum object
 */
function createEnum(labels, startIndex = 0) {
  return Object.freeze(labels.reduce((enu, label, i) => {enu[label] = i + startIndex; return enu;}, {}));
}


function _traverseAndFlatten(currentNode, target, flattenedKey) {
  for (var key in currentNode) {
    if (currentNode.hasOwnProperty(key)) {
      const newKey = flattenedKey === undefined ? key : flattenedKey + '.' + key;
      var value = currentNode[key];
      if (typeof value === "object")
        _traverseAndFlatten(value, target, newKey);
      else
        target[newKey] = value;
    }
  }
}
function flatten(obj) {
  var flattenedObject = {};
  _traverseAndFlatten(obj, flattenedObject);
  return flattenedObject;
}

module.exports = {
  delay,
  promiseProps,
  promiseEach,
  promiseMap,
  isPromise,
  createEnum,
  getFuncArgs,
  flatten,
  test: require('./test'),
  ...require('./generateId'),
  ...require('./datetime')
};
