/**
 * HTTP interface with session support.
 */

'use strict';

let _session;
let _clientHttp;
let accessToken;
let _onLogin;

/**
 * Facade method of HTTP Request implementation.
 * It composes httpConfig object for request.
 * There is some base httpConfig object used usually.
 * @param {string} method - HTTP method
 * @param {string} url - URL
 * @param {Object} data - POST data
 * @param {Object} httpConfig - axios like config
 * @return {Promise<Object>} resolves regular http request
 */
async function _httpRequest(method, url, data, httpConfig) {
  const _httpConfig = Object.assign({method, url}, httpConfig);
  if (data)
    _httpConfig.data = data;
  if (!_httpConfig.headers)
    _httpConfig.headers = {};
  return await _requestFlow(_httpConfig);
}

/**
 * Implementation of authentication logic.
 * @param {Object} httpConfig - axios like config
 * @return {Promise<Object>} resolves regular http request
 */
async function _requestFlow(httpConfig) {
  if (!_session.isLoggedIn())
    if (!await _onLogin(_session))
      throw Error('Incorrect login');

  if (accessToken) {
    try {
      return await _requestWithAccessToken(httpConfig);
    } catch (err) {
      // the access token is expired
      if (err.response.status === 401)
        // it needs to get another access token
        accessToken = null;
      else
        throw err;
    }
  }

  try {
    accessToken = await _session.loadAccessToken();
  } catch (err) {
    // session token is expired
    // we need to login
    if (!await _onLogin(_session))
      throw Error('Incorrect login');

    try {
      accessToken = await _session.loadAccessToken();
    } catch (err) {
      // can't get access token by fresh session token
      // it's an ERROR to log
    }
  }

  return await _requestWithAccessToken(httpConfig);
}

/**
 * Adding access token to HTTP header and finally call HTTP request method of clientHttp interface.
 * @param {object} config - config interface
 * @return {object} regular HTTP response
 */
async function _requestWithAccessToken(config) {
  config.headers.Authorization = `JWT ${accessToken}`;
  return await _clientHttp.request(config);
}

module.exports = function sessionHttp(session, onLogin, clientHttp) {
  _session = session;
  _onLogin = onLogin || (async () => {
    throw new Error();
  });
  _clientHttp = clientHttp;
  return {
    get: async (url, config) => await _httpRequest('get', url, null, config),
    post: async (url, data, config) => await _httpRequest('post', url, data, config),
    rawPost: async (url, data, config) => await _httpRequest('rawPost', url, data, config),
    rawGet: async (url, config) => await _httpRequest('rawGet', url, null, config),
    rawGetStream: async (url, config) => await _httpRequest('rawGetStream', url, null, config),
    update: async (url, data, config) => await _httpRequest('update', url, data, config),
    patch: async (url, data, config) => await _httpRequest('patch', url, data, config),
    delete: async (url, config) => await _httpRequest('delete', url, null, config)
  };
};
