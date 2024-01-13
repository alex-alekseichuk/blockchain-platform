'use strict';
/* global window, FileReader */
const utils = require('../utils');
const cryptoModule = require('../../util/crypto');
let crypto;
const {calcHash} = require('../utils');

module.exports = async(file, key, fileHash) => {
  crypto = await cryptoModule();
  if (isServer()) {
    return serverSide(file, key, fileHash);
  }
  return clientSide(file, key, fileHash);
};

/**
 *
 * @param {Uint8Array} file -
 * @param {bs58} key -
 * @param {bs58} fileHash -
 * @return {Promise<Object>} encryptedFile and hash
 */
async function serverSide(file, key, fileHash) {
  const encryptedFile = crypto.async_encrypt(file, crypto.pubenc(key));
  const hash = await calcHash(encryptedFile, fileHash);
  return {encryptedFile, hash};
}

/**
 *
 * @param {bs58} file -
 * @param {bs58} key -
 * @param {array} fileHash -
 * @return {Promise<Object>} encryptedFile and hash
 */
function clientSide(file, key, fileHash) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsArrayBuffer(file);

    reader.onload = event => {
      const content = event.target.result;
      const encrypted = crypto.symEncrypt(new Uint8Array(content), key, utils.nonce());
      const hash = crypto.crypto_hash(new Uint8Array(encrypted));

      if (fileHash) {
        let newBuffer = new Uint8Array(fileHash.length + hash.length);
        newBuffer.set(fileHash);
        newBuffer.set(hash, fileHash.length);
        fileHash = crypto.crypto_hash(newBuffer);
      } else {
        fileHash = hash;
      }
      resolve({
        encryptedFile: encrypted,
        hash
      });
    };

    reader.onerror = err => {
      reject(err);
    };
  });
}

/**
 * Check is it browser or nodejs.
 * @return {boolean} true if it's not browser
 */
function isServer() {
  return !(typeof window !== 'undefined' && window.document);
}
