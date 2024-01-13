/**
 *
 * Implementation of key-value storage interface
 * based on browser's localStorage
 * to be used in web SPA.
 * For now, it supports data structure of existing ng-rt-admin.
 */

'use strict';
/* eslint-disable no-undef */

module.exports = {
  __name: 'storage',
  get: async key => {
    if (typeof (Storage) === "undefined")
      return;
    return localStorage.getItem(key);
  },
  save: async (key, value) => {
    if (typeof (Storage) === "undefined")
      return;
    if (typeof key === 'object') {
      for (const k in key) {
        if (key.hasOwnProperty(k))
          localStorage.setItem(k, key[k]);
      }
      return;
    }
    localStorage.setItem(key, value);
  },
  remove: async key => {
    if (typeof (Storage) === "undefined")
      return;
    if (typeof key === 'string') {
      localStorage.removeItem(key);
      return;
    }
    if (Array.isArray(key)) {
      for (const k of key)
        localStorage.removeItem(k);
    }
  }
};
