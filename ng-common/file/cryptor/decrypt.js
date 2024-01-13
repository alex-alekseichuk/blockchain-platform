'use strict';
const utils = require('../utils');
const cryptoModule = require('../../util/crypto');
const {calcHash} = require('../utils');

module.exports = async(data, decryptedKey, fileHash) => {
  const crypto = await cryptoModule();
  const decrypted = crypto.symDecrypt(new Uint8Array(data), decryptedKey, utils.nonce());

  const hash = await calcHash(data, fileHash);
  return {
    decryptedFile: decrypted,
    hash
  };
};
