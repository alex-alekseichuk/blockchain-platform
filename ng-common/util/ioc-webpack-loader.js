/**
 * Webpack loader.
 * It adds __components and __dependencies for modules injected via IoC/DI.
 */
'use strict';

module.exports = function(source) {
  this.cacheable();

  let m1;
  try {
    m1 = require(this.resource);
  } catch (e) {
    return source;
  }

  source += processFactory(m1);

  return source;
};

function processFactory(factory, prefix, level) {
  prefix = prefix || '';
  level = level || 0;
  let result = '';
  if (typeof factory === 'function' && !isClass(factory) && !(factory.__name && factory.__dependencies)) {
    if (!factory.__name)
      result += `module.exports${prefix}.__name = '${factory.name}';` + "\n";
    if (!factory.__dependencies)
      result += `module.exports${prefix}.__dependencies = [${getFuncArgs(factory).map(s => `'${s}'`).join(',')}];` + "\n";
    return result;
  }
  if (typeof factory === 'object' && factory.__name) {
    return result;
  }
  if (level >= 3)
    return result;

  if (typeof factory === 'object' && factory.name && factory.hasOwnProperty) {
    for (const key of Object.keys(factory))
      if (factory.hasOwnProperty(key) && factory[key])
        result += processFactory(factory[key], `${prefix}.${factory.name}`, level + 1);
  }
  return result;
}

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
    .replace(RegExp('\\n', 'g'), '')
    .replace(RegExp('=>.*$', 'g'), '')
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

function isClass(func) {
  return typeof func === 'function'
    && /^class\s/.test(Function.prototype.toString.call(func));
}
