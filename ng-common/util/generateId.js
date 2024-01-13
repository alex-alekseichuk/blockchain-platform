'use strict';
/* global window */

const getTimestamp = () => {
  if (typeof window !== 'undefined') {
    return Math.floor(window.performance.now());
  }
  const t = process.hrtime();
  return Math.floor(t[0] * 1000000.0 + t[1] / 1000.0);
};
const prefix = String(Math.floor(Math.random() * 10));
const postfix = Math.floor(Math.random() * 36).toString(36);
const start = getTimestamp();

/**
 * Generate short ID
 * @memberof project.utils
 * @return {string} generated ID
 */
const generateShortId = function() {
  return prefix + Math.abs(getTimestamp() - start).toString(36) + postfix;
};

module.exports = {
  generateShortId,
  generateId: require('uuid/v4')
};
