/**
 * API to loads keys.
 * It's provided by ng-rt-core.
 * TODO: make it not just load, but full keys management
 * It's not used for now.
 */
'use strict';

module.exports = function apiKeys(config, sessionHttp) {
  const httpConfig = config.api.keys;
  return {
    loadKeys: async () => (await sessionHttp.get('/ng-rt-core/keys', httpConfig)).data
  };
};
