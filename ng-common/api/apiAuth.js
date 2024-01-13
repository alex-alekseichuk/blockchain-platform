/**
 * API to auth routes. It's used in session module internally.
 * It should not be used in an application directly.
  It's not used for now.
 */
'use strict';

module.exports = function apiAuth(config, clientHttp) {
  const httpConfig = config.api.auth;
  return {
    login: async data => (await clientHttp.post('/auth/login', data, httpConfig)).data,
    getAccessToken: async token => (await clientHttp.post('/auth/access', {token}, httpConfig)).data.token
  };
};
