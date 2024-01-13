'use strict';

module.exports = (config, sessionHttp) => {
  const _config = config;
  const _sessionHttp = sessionHttp;
  return {
    download: (keyService, logger, cryptor) => require('./download')(_config, _sessionHttp, keyService, logger, cryptor),
    upload: (file, cryptor) => require('./upload')(_config, _sessionHttp, file, cryptor)
  };
};
