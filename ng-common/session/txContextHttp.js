/**
 * HTTP interface with v.3.2 txContext
 * It's used in ng-rt-digitalAsset-sdk-samples.
 * It's for backward compatibility with dev/3.2.
 */

'use strict';

let _txContext;
let _clientHttp;

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

  const serverSettings = _txContext.serverEnvironment;
  const jwtHeader = 'JWT ' + _txContext.jwtToken;
  if (serverSettings.proxyEnabled) {
    Object.assign(_httpConfig.headers, {
      Authorization: jwtHeader,
      Cookie: serverSettings.proxyToken
    });
  } else {
    Object.assign(_httpConfig.headers, {
      Authorization: jwtHeader
    });
  }
  // let url = serverSettings.serverUrl;
  // if (!url.endsWith('/')) {
  //   url += '/';
  // }
  // url += digitalAssetApiRoute;

  return await _clientHttp.request(_httpConfig);
}

module.exports = function sessionHttp(txContext, clientHttp) {
  _txContext = txContext;
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
