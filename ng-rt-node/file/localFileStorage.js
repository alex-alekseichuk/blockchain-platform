/**
 * Implementation of File Storage for uploading and downloading files.
 * It's based on pure FS. It holds files in the `files` fsubolder.
 * File Storage is for saving file content only.
 * @requires fs-extra
 */
'use strict';
const fs = require('fs-extra');
const path = require('path');
const storageDir = './files';
module.exports = async function fileStorage(logger) {
  const _logger = logger.get('ng-rt-node:file/localFileStorage');
  await fs.ensureDir(storageDir);
  return {
    writeBuffer: async (fileId, buffer) => {
      const filePath = path.join(storageDir, fileId);
      try {
        await fs.writeFile(filePath, buffer);
      } catch (err) {
        _logger.error(`Can't write content to ${filePath} for fileId: ${fileId}`);
        throw err;
      }
    },
    readBuffer: async (fileId) => {
      const filePath = path.join(storageDir, fileId);
      try {
        return await fs.readFile(filePath);
      } catch (err) {
        _logger.error(`Can't read from to ${filePath}  for fileId: ${fileId}`);
        throw err;
      }
    },
    writeStream: async (fileId, stream) => {
      const filePath = path.join(storageDir, fileId);
      try {
        const fileStream = fs.createWriteStream(filePath);
        await pipelineAndWait(stream, fileStream);
      } catch (err) {
        _logger.error(`Can't write stream to ${filePath} for fileId: ${fileId}`);
        throw err;
      }
    },
    readStream: fileId => {
      const filePath = path.join(storageDir, fileId);
      try {
        return fs.createReadStream(filePath);
      } catch (err) {
        _logger.error(`Can't read stream from ${filePath} for fileId: ${fileId}`);
        throw err;
      }
    }
  };
};

function pipelineAndWait(src, dest) {
  return new Promise((resolve, reject) => {
    src.on("error", err => {
      reject(err);
    });
    dest.on("finish", () => {
      resolve();
    });
    src.pipe(dest);
  });
}