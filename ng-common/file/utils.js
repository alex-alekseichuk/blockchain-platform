'use strict';
/* global window */
const cryptoModule = require('../util/crypto');
module.exports = {
  nonce: () => new Uint8Array([1, 2, 3, 4, 5, 6, 7, 8, 9, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 0, 1, 2, 3, 4]),
  _base64ToArrayBuffer: base64 => {
    const binaryString = window.atob(base64);
    let bytes = new Uint8Array(binaryString.length);

    bytes.forEach((el, i) => {
      bytes[i] = binaryString.charCodeAt(i);
    });

    return bytes.buffer;
  },
  calcHash: async(data, fileHash) => {
    let _fileHash = fileHash;
    const crypto = await cryptoModule();
    const hash = crypto.crypto_hash(new Uint8Array(data));

    if (_fileHash) {
      let newBuffer = new Uint8Array(_fileHash.length + hash.length);
      newBuffer.set(_fileHash);
      newBuffer.set(hash, _fileHash.length);
      _fileHash = crypto.crypto_hash(newBuffer);
    } else {
      _fileHash = hash;
    }
    return _fileHash;
  },
  isServer: () => {
    return !(typeof window !== 'undefined' && window.document);
  }
};
