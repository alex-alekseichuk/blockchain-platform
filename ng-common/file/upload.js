'use strict';
/* global window FileReader */
const {encrypt} = require('./cryptor');
const cryptoModule = require('../util/crypto');
const blockSize = 4 * 1024 * 1024;
const utils = require('./utils');

/**
 *
 * @param {Object} config - Client config
 * @param {Object} http - Http client
 * @param {Object} file -
 * @param {Object} cryptor -
 * @return {Object} Main function and interfaces
 */
async function main(config, http, file, cryptor) {
  const crypto = await cryptoModule();
  let {hash, key, content, id, size, blocksCount} = file;
  let headers = {size};

  if (id) headers.fileId = id;

  let fileId;
  for (let index = 0; index < blocksCount; index++) {
    emitPercent(index / blocksCount);

    const {offset, last} = calcOffset(index, blockSize, size);
    let splittedContent = await strToBuffer(content, offset, last);
    if (cryptor) {
      const encData = await encrypt(content, key, hash);
      splittedContent = encData.encryptedFile;
      hash = encData.hash;
    } else {
      hash = hash || crypto.keys.crypto_hash(new Uint8Array(content));
    }
    fileId = await rawUpload(http, splittedContent, headers, id);
  }
  return {hash, fileId};
}

/**
 * Something for progress bar
 * @param {number} percent -
 */
function emitPercent(percent) {
  if (!utils.isServer()) {
    window.uploadFile.emit('data', percent); // for progress bar
  }
}

/**
 *
 * @param {Object} http -
 * @param {Object} content -
 * @param {Object} headers -
 * @param {string} fileId -
 * @return {Promise<fileId>} File ID
 */
function rawUpload(http, content, headers, fileId) {
  return new Promise((resolve, reject) => {
    http.rawUpload('/ng-rt-file-service-backend/upload', content, headers, (result, xhr) => {
      if (!result) {
        if (xhr.response && xhr.response.err) {
          return reject(xhr.response.err);
        }
        return reject();
      }

      if (!fileId) {
        fileId = result.fileId;
      }

      resolve(fileId);
    });
  });
}

/**
 * Calculate Offset
 * @param {number} index -
 * @param {number} blockSize -
 * @param {number} size -
 * @return {Object} offset and last
 */
function calcOffset(index, blockSize, size) {
  const offset = index * blockSize;
  let last = offset + blockSize;
  if (last > size) {
    last = size;
  }
  return {offset, last};
}

/**
 * String to buffer
 * @param {string} content - the content
 * @param {number} offset -
 * @param {number} last -
 * @return {Promise<Buffer>} The buffer
 */
function strToBuffer(content, offset, last) {
  return new Promise((resolve, reject) => {
    if (utils.isServer()) {
      return resolve(toArrayBuffer(content).slice(offset, last));
    }
    const reader = new FileReader();

    reader.onload = event => {
      resolve(event.target.result);
    };

    reader.onerror = err => {
      reject(err);
    };

    reader.readAsArrayBuffer(content.slice(offset, last));
  });
}

module.exports = main;
module.exports.calcOffset = calcOffset;
module.exports.emitPercent = emitPercent;
module.exports.rawUpload = rawUpload;

/**
 * Convert to ArrayBuffer
 * @param {array} buf - array of bytes
 * @return {ArrayBuffer} content in the form of ArrayBuffer
 */
function toArrayBuffer(buf) {
  const arrayCopy = new Uint8Array(buf.length);
  const len = buf.length;
  for (let i = 0; i < len; i++) {
    arrayCopy[i] = buf[i];
  }
  return arrayCopy.buffer;
}
