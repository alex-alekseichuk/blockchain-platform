/**
 * Storage implementation for saving key/values in ~/.project/.storage.json file.
 * It's used for saving configs, keys, etc. for CLI tools.
 * TODO: make sure ~/.project/.storage.json available for the user only; others should not be able to even read it!
 */
'use strict';
const path = require('path');
const fs = require('fs-extra');
const userHome = require('user-home');
const storageFilePath = path.join(userHome, '.project', '.storage.json');
let data;

/**
 * File session storage.
 * It's used as session storage for CLI tools based on ng-common.
 */
module.exports = {
  __name: 'storage',
  get: async key => {
    await load();
    return data[key];
  },
  save: async (key, value) => {
    await load();
    if (typeof key === 'string') {
      data[key] = value;
    }
    if (typeof key === 'object') {
      for (const k in key) {
        data[k] = key[k];
      }
    }
    await save();
  },
  remove: async key => {
    await load();
    if (typeof key === 'string') {
      delete data[key];
    }
    if (Array.isArray(key)) {
      for (const k of key)
        delete data[k];
    }
    await save();
  }
};

async function save() {
  if (!data)
    return;
  try {
    await fs.writeJson(storageFilePath, data);
  } catch (err) {
    console.error(err.message);
  }
}

async function load() {
  if (data)
    return;
  try {
    data = await fs.readJson(storageFilePath);
  } catch (err) {
    console.error(err.message);
    data = {};
  }
}