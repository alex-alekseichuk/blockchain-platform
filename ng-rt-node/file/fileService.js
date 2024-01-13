/**
 * Service to upload and download files.
 * There are 2 parts:
 *   1) fileStorage of file content
 *   2) registry of file info
 * So, this module provides #2 fileInfo, but not fileStorage.
 * fileStorage is dependency, and used from another module.
 *
 * @requires fs-extra
 */
'use strict';
const fs = require('fs-extra');
const path = require('path');
const util = require('ng-common').common.util;

let _fileStorage;
const fileInfoDir = './files'; // fileInfo saved into the same dir as file content

module.exports = function fileService(fileStorage, logger) {
  _fileStorage = fileStorage;
  const _logger = logger.get('ng-rt-node:file/fileService');
  const service = {
    getFileInfo: async (ctx, fileId) => {
      const filePath = path.join(fileInfoDir, `${fileId}.json`);
      try {
        return await fs.readJson(filePath);
      } catch (err) {
        _logger.error(`Can't read fileInfo from ${filePath} for ${fileId}`);
        return null;
      }
    },
    writeFile: async (ctx, fileInfo, buffer) => {
      fileInfo = fileInfo || {};
      try {
        fileInfo.id = util.generateId();
        await _fileStorage.writeBuffer(fileInfo.id, buffer);
        await fs.writeJson(path.join(fileInfoDir, `${fileInfo.id}.json`), fileInfo)
      } catch (err) {
        _logger.error(`Can't write file for fileId: ${fileInfo.id}`);
        throw err;
      }
      return fileInfo;
    },
    writeBlock: async (ctx, blockInfo, buffer) => {
      try {
        if (!blockInfo.fileId || !blockInfo.block) {
          return false;
        }
        const fileInfo = await service.getFileInfo(ctx, blockInfo.fileId);
        if (!fileInfo || !fileInfo.blocksNum) {
          return false;
        }
        if (blockInfo.block < 1 || blockInfo.block >= fileInfo.blocksNum) {
          return false;
        }
        await _fileStorage.writeBuffer(`${blockInfo.fileId}-${blockInfo.block}`, buffer);
      } catch (err) {
        _logger.error(`Can't write block ${blockInfo.block} of fileId: ${blockInfo.fileId}`);
        throw err;
      }
      return true;
    },
    readBlock: async (ctx, blockInfo) => {
      try {
        return await _fileStorage.readBuffer(blockInfo.block ? `${blockInfo.fileId}-${blockInfo.block}`: blockInfo.fileId);
      } catch (err) {
        _logger.error(`Can't read block ${blockInfo.block} of fileId: ${blockInfo.fileId}`);
        throw err;
      }
    },
    writeStream: async (ctx, fileInfo, stream) => {
      fileInfo = fileInfo || {};
      fileInfo.id = util.generateId();
      try {
        await _fileStorage.writeStream(fileInfo.id, stream);
        await fs.writeJson(path.join(fileInfoDir, `${fileInfo.id}.json`), fileInfo);
      } catch (err) {
        _logger.error(`Can't write stream for fileId: ${fileInfo.id}`);
        throw err;
      }
      return fileInfo;
    },
    readStream: (ctx, fileId) => {
      try {
        return _fileStorage.readStream(fileId);
      } catch (err) {
        _logger.error(`Can't read stream for fileId: ${fileId}`);
        throw err;
      }
    }
  };
  return service;
};
