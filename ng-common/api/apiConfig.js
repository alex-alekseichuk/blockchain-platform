/**
 * Config API is to load client config.
 * It's a public API used in an application.
 * It's used by client to load client config from server.
 *
 * There are axios http configs in `api` section. They have baseURL's of other API's provided by server(s).
 *
 * There are digitalAsset definitions in `digitalAsset` section.
 *
 * {
      "api": {
        "auth": {"baseURL": "http://localhost:8443/"},
        "demoTx": {"baseURL": "http://localhost:8443/"}
      },
      digitalAsset: {
        demoTx: 'bigchaindb2Official'
      }
    },
 * @param {object} bootHttpConfig - config to connect to Config Server
 * @param {object} clientHttp - client HTTP interface to connect to HTTP server
 * @return {object} interface to Config API to load the config from the server.
 */
'use strict';

const apiUtils = require('./util');

const api = function apiConfig(logger, bootHttpConfig, clientHttp) {
  const _logger = logger.get('common:api/apiConfig');
  return {
    loadConfig: async function config() {
      try {
        return (await clientHttp.get('api-config', bootHttpConfig)).data;
      } catch (response) {
        apiUtils.handleResponse(response, _logger);
      }
    }
  };
};

module.exports = api;
