/**
 * File upload/download via apiFiles for nodejs applications, like cli tools, server, etc.
 * It supports encryption/decryption.
 * It splits too large file into chunks.
 * It's uses HTTP blocks, not stream version.
 * TODO: Events to show progress of uploading/downloading.
 * TODO: stream version. via websocket?
 */
'use strict';
const fs = require('fs-extra');
const path = require('path');
let _logger, _apiFiles, _crypto;
module.exports = function file(logger, apiFiles, crypto) {
  _logger = logger.get('common:nodejs/file');
  _apiFiles = apiFiles;
  _crypto = crypto;
  return {
    uploadFile: async (filePath, hexKey) => {
      let stats;

      try {
        stats = fs.statSync(filePath);
      } catch (err) {
        _logger.error(`Can't get stat for file ${filePath}`);
        throw err;
      }

      const filename = path.basename(filePath);
      const size = stats.size;
      const blockSize = _apiFiles.blockSize;
      if (size <= blockSize) {
        let content;

        content = await read(filePath);

        return await uploadFile(content, {
          filename,
          size
        }, hexKey);
      } else {
        const blocksNum = Math.floor(size / blockSize) + (size % blockSize > 0 ? 1 : 0);
        let content = await read(filePath, 0, blockSize);
        const fileInfo = await uploadFile(content, {
          filename,
          size,
          blockSize,
          blocksNum
        }, hexKey);

        for (let iBlock = 1; iBlock < blocksNum; iBlock++) {
          let content = await read(filePath, iBlock * blockSize, blockSize);
          await uploadFile(content, {
            fileId: fileInfo.id,
            block: iBlock,
          }, hexKey);
        }
        return fileInfo;
      }
    },
    downloadFile: async (fileId, hexKey, filePath) => {
      let file;
      try {
        file = await _apiFiles.downloadFile(fileId);
      } catch (err) {
        _logger.error(`Can't download fileId ${fileId}`);
      }
      if (hexKey)
        decrypt(file, hexKey);
      // TODO: modify filePath if such file already exists
      filePath = filePath || file.filename || 'download';

      try {
        await fs.writeFile(filePath, file.data);
      } catch (err) {
        _logger.error(`Can't write to file ${filePath}`);
        throw err;
      }

      if (file.blocksNum && file.blocksNum > 1) {
        for (let iBlock = 1; iBlock < file.blocksNum; iBlock++) {
          let file;
          try {
            file = await _apiFiles.downloadBlock(fileId, iBlock);
          } catch (err) {
            _logger.error(`Can't download fileID: ${fileId}`);
            throw err;
          }
          if (hexKey)
            decrypt(file, hexKey);
          try {
            await fs.appendFile(filePath, file.data);
          } catch (err) {
            _logger.error(`Can't append to file ${filePath}`);
            throw err;
          }
        }
      }
    }
  };
};

async function uploadFile(content, fileInfo, hexKey) {
  if (hexKey)
    content = encrypt(content, hexKey);
  try {
    return await _apiFiles.uploadFile(content, fileInfo);
  } catch (err) {
    _logger.error(`Can't upload file ${fileInfo.filename}`);
    throw err;
  }
}

async function read(filePath, offset, size) {
  try {
    if (!offset || !size)
      return await fs.readFile(filePath);
  } catch (err) {
    _logger.error(`Can't read file ${filePath}`);
    throw err;
  }
  return new Promise((resolve, reject) => {
    const reader = fs.createReadStream(filePath, {
      start: offset,
      end: offset + size
    });
    reader.on('data', function (data) {
      resolve(data);
    });
    reader.on('error', function (error) {
      _logger.error(`Can't read file ${filePath}`);
      reject(error);
    });
  });
}

function encrypt(content, hexKey) {
  const nonce = _crypto.symNonce();
  const key = _crypto.hexToUint(hexKey);
  const cipherText = _crypto.symEncrypt(new Uint8Array(content), key, nonce);
  content = new Uint8Array(nonce.length + cipherText.length);
  content.set(nonce);
  content.set(cipherText, nonce.length);
  return content;
}
function decrypt(file, hexKey) {
  let content = file.data;
  const key = _crypto.hexToBytes(hexKey);
  const symNonceLen = _crypto.symNonceLen();
  const nonce = content.slice(0, symNonceLen),
    cipherText = content.slice(symNonceLen);
  content = _crypto.symDecrypt(cipherText, new Uint8Array(key), nonce);
  file.data = content;
}
