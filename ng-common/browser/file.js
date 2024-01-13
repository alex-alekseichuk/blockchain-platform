/**
 * Upload/Download file to File storage apiFile.
 * It supports encryption/decryption.
 * It splits too large file into chunks.
 * TODO: error's handling/throwing for fs and apiFile functions.
 * TODO: Events to show progress of uploading/downloading.
 * TODO: Upload/Download as a stream.
 */
'use strict';
const fs = require('./fs');
const BLOB_SIZE = 40 * 1024 * 1024; // 40M
let _apiFiles;
let _crypto;
module.exports = function file(apiFiles, crypto) {
  _apiFiles = apiFiles;
  _crypto = crypto;
  return {
    uploadFile: async (file, hexKey) => {
      const size = file.size;
      const blockSize = _apiFiles.blockSize;
      if (size <= blockSize) {
        let content = await fs.readFile(file);
        return await uploadFile(content, {
          filename: file.name,
          size
        }, hexKey);
      } else {
        const blocksNum = Math.floor(size / blockSize) + (size % blockSize > 0 ? 1 : 0);
        let content = await fs.readFile(file, 0, blockSize);
        const fileInfo = await uploadFile(content, {
          filename: file.name,
          size,
          blockSize,
          blocksNum
        }, hexKey);

        for (let iBlock = 1; iBlock < blocksNum; iBlock++) {
          let content = await fs.readFile(file, iBlock * blockSize, blockSize);
          await uploadFile(content, {
            fileId: fileInfo.id,
            block: iBlock,
          }, hexKey);
        }
        return fileInfo;
      }
    },
    downloadFile: async (fileId, hexKey) => {
      const file = await downloadFile(fileId, hexKey);
      if (!file.blocksNum || file.blocksNum === 0) {
        await fs.writeFile(file.filename, file.data);
        return;
      }
      if (file.size < BLOB_SIZE)
        await blobDownloadScenario(fileId, hexKey, file);
      else
        await fsDownloadScenario(fileId, hexKey, file);
    }
  };
};

async function uploadFile(content, fileInfo, hexKey) {
  if (hexKey)
    content = encrypt(content, hexKey);
  return await _apiFiles.uploadFile(content, fileInfo);
}

async function blobDownloadScenario(fileId, hexKey, file) {
  const chunks = [];
  chunks.push(file.data);
  for (let iBlock = 1; iBlock < file.blocksNum; iBlock++) {
    const block = await downloadBlock(fileId, iBlock, hexKey);
    chunks.push(block.data);
  }
  const blob = new Blob(chunks, {type: 'application/octet-stream'});
  fs.writeFile(file.filename, blob);
}
async function fsDownloadScenario(fileId, hexKey, file) {
  const {resultFileEntry, fsWriter} = await initFs(file, fileId);
  return new Promise((resolve, reject) => {
    let iBlock = 0;
    fsWriter.onwriteend = async function() {
      iBlock++;
      if (iBlock < file.blocksNum) {  
        // get next chunk
        const block = await downloadBlock(fileId, iBlock, hexKey);
        fsWriter.write(new Blob([block.data], {
          type: 'application/octet-stream'
        }));
        return;
      }
      resultFileEntry.file(function(resultFile) {
        const reader = new FileReader();
        reader.onloadend = function() {
          resultFileEntry.remove(function() {
            const blob = new Blob([reader.result], {type: 'application/octet-stream'});
            fs.writeFile(file.filename, blob);
            resolve();
          }, reject);
        };
        reader.onerror = reject;
        reader.readAsArrayBuffer(resultFile);
      }, reject);
    };
    fsWriter.onerror = function(err) {
      reject(err);
    };
    
    // write first chunk
    fsWriter.write(new Blob([file.data], {
      type: 'application/octet-stream'
    }));
  });
}

async function initFs(file, fileId) {
  const fileSize = file.size * 2 > 255 ? file.size * 2 : 255;
  const resultFileName = fileId;
  return new Promise((resolve, reject) => {
    if (!navigator.webkitPersistentStorage)
      return reject(Error(`navigator.webkitPersistentStorage is not supported by this browser. Please, use Google Chrome.`));
    // window.webkitStorageInfo.requestQuota(window.PERSISTENT, fileSize, function(grantedBytes) {
    navigator.webkitPersistentStorage.requestQuota(fileSize, function(grantedBytes) {
      if (grantedBytes < fileSize)
        return reject(Error(`Granted bytes [${grantedBytes}] less than required storage size [${fileSize}]`));
      (window.requestFileSystem || window.webkitRequestFileSystem)(window.PERSISTENT, fileSize, function(fs) {
        fs.root.getFile(resultFileName, {create: true}, function(resultFileEntry) {
          resultFileEntry.createWriter(function(fsWriter) {
            resolve({resultFileEntry, fsWriter});
          }, reject);
        }, reject);
      }, reject);
    }, reject);
  });
}

async function downloadFile(fileId, hexKey) {
  const file = await _apiFiles.downloadFile(fileId);
  if (hexKey)
    await decrypt(file, hexKey);
  return file;
}
async function downloadBlock(fileId, block, hexKey) {
  const file = await _apiFiles.downloadBlock(fileId, block);
  if (hexKey)
    await decrypt(file, hexKey);
  return file;
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
async function decrypt(file, hexKey) {
  let content = file.data;
  content = await blob2Array(content);
  const key = _crypto.hexToUint(hexKey);
  const symNonceLen = _crypto.symNonceLen();
  const nonce = content.slice(0, symNonceLen),
    cipherText = content.slice(symNonceLen);
  content = _crypto.symDecrypt(new Uint8Array(cipherText), key, new Uint8Array(nonce));
  file.data = new Blob([content.buffer]);
}
function blob2Array(blob) {
  const fileReader = new FileReader();
  return new Promise(resolve => {
    fileReader.onload = function(event) {
      resolve(fileReader.result);
    };
    fileReader.readAsArrayBuffer(blob);
  });
}
