'use strict';

const DownloadService = require('./service/download');

module.exports = (config, http, keysService, logger, cryptor) => {
  return new DownloadService(http, keysService, logger, cryptor);
};
