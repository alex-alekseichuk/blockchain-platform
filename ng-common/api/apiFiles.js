/**
 * API to upload and download files.
 *
 * @param {Object} config - Client config
 * @param {Object} sessionHttp - Http client interface with auth.
 * @return {Object} Files API
 */
'use strict';

const apiUtils = require('./util');

const api = function apiFiles(logger, config, sessionHttp) {
  const _logger = logger.get('common:api/apiFiles');
  const _httpConfig = config.api.files;
  return {
    blockSize: 50 * 1024 * 1024, // 50M
    uploadFile: async (content, fileInfo) => {
      const httpConfig = Object.assign({}, _httpConfig);
      const headers = Object.assign({}, _httpConfig.headers);
      if (fileInfo && fileInfo.block) {
        if (fileInfo.fileId)
          headers['X-FileId'] = fileInfo.fileId;
        if (fileInfo.block)
          headers['X-Block'] = fileInfo.block;
        httpConfig.headers = headers;

        try {
          return (await sessionHttp.rawPost(`files/${fileInfo.fileId}/`, content, httpConfig)).data;
        } catch (response) {
          apiUtils.handleResponse(response, _logger, {
              '404': () => {
                _logger.warn(`Unknown fileId: ${id}`);
                throw new apiUtils.ApiError(api.UNKNOWN_FILE);
              }
            }
          );
        }
      }

      if (fileInfo) {
        if (fileInfo.filename)
          headers['X-Filename'] = fileInfo.filename;
        if (fileInfo.size)
          headers['X-Filesize'] = fileInfo.size;
        if (fileInfo.blockSize)
          headers['X-Blocksize'] = fileInfo.blockSize;
        if (fileInfo.blocksNum)
          headers['X-BlocksNum'] = fileInfo.blocksNum;
      }
      httpConfig.headers = headers;

      try {
        return (await sessionHttp.rawPost('files/', content, httpConfig)).data;
      } catch (response) {
        apiUtils.handleResponse(response, _logger);
      }
    },

    downloadFile: async fileId => {
      let res;
      try {
        res = await sessionHttp.rawGet(`files/${fileId}/`, _httpConfig);
      } catch (response) {
        apiUtils.handleResponse(response, _logger, {
            '404': () => {
              _logger.warn(`Unknown fileId: ${id}`);
              throw new apiUtils.ApiError(api.UNKNOWN_FILE);
            }
          }
        );
      }
      const result = {
        data: res.data,
        filename: res.headers['x-filename'],
        size: res.headers['x-filesize']
      };
      if (res.headers['x-blocksize'])
        result.blockSize = Number(res.headers['x-blocksize']);
      if (res.headers['x-blocksnum'])
        result.blocksNum = Number(res.headers['x-blocksnum']);
      return result;
    },

    downloadBlock: async (fileId, block) => {
      let res;
      try {
        res = await sessionHttp.rawGet(`files/${fileId}/${block}/`, _httpConfig);
      } catch (response) {
        apiUtils.handleResponse(response, _logger, {
            '404': () => {
              _logger.error(`Unknown fileId: ${id}`);
              throw new apiUtils.ApiError(api.UNKNOWN_FILE);
            }
          }
        );
      }
      return {
        data: res.data
      };
    },

    uploadStream: async (stream, fileInfo) => {
      const httpConfig = Object.assign({}, _httpConfig);
      const headers = Object.assign({}, _httpConfig.headers);
      if (fileInfo && fileInfo.filename)
        headers['X-Filename'] = fileInfo.filename;
      if (fileInfo && fileInfo.size)
        headers['X-Filesize'] = fileInfo.size;
      httpConfig.headers = headers;
      try {
        return (await sessionHttp.rawPost('stream/', stream, httpConfig)).data;
      } catch (response) {
        apiUtils.handleResponse(response, _logger);
      }
    },

    downloadStream: async fileId => {
      let res;
      try {
        res = await sessionHttp.rawGetStream(`stream/${fileId}/`, _httpConfig);
      } catch (response) {
        apiUtils.handleResponse(response, _logger, {
            '404': () => {
              _logger.warn(`Unknown fileId: ${id}`);
              throw new apiUtils.ApiError(api.UNKNOWN_FILE);
            }
          }
        );
      }
      return {
        stream: res.data,
        filename: res.headers['x-filename']
      };
    }
  };
};

Object.assign(api, apiUtils.enumApiErrors([
  'UNKNOWN_FILE'
]));

module.exports = api;
