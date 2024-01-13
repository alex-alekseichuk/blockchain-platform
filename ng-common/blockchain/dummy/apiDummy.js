/**
 * Http api for Dummy Blockchain HTTP interface
 *
 * @param {Object} config - Client config
 * @param {Object} sessionHttp - Http client interface with auth.
 * @return {object} interface to Blockchain HTTP API to load the config from the server.
 */
'use strict';

const apiUtils = require('../../api/util');

module.exports = function apiDummy(logger, config, sessionHttp) {
  const _logger = logger.get('common:blockchain/dummy/apiDummy');
  const httpConfig = config.api.dummy;
  return {
    postTx: async signedTx => {
      try {
        return (await sessionHttp.post('blockchain/dummy/', signedTx, httpConfig)).data;
      } catch (response) {
        apiUtils.handleResponse(response, _logger);
      }
    }
  };
};
