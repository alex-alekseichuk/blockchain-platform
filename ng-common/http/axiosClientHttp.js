/**
 * Http client based on axios library.
 * It provides the same interface as axios.
 * It provides clientId in the header.
 *
 * It provides clientHttp interface.
 *
 * @requires axios
 */
'use strict';
const _http = require('axios');
let _clientIdUtil;
let _runtime = 'nodejs';
let _logger;

module.exports = function clientHttp(logger, clientIdUtil, runtime) {
  _logger = logger.get('common:http/axios');
  _clientIdUtil = clientIdUtil;
  _runtime = runtime || _runtime;
  return {
    get: async (url, config) => await request('get', url, null, config),
    post: async (url, data, config) => await request('post', url, data, config),
    rawPost: async (url, data, config) => await request('rawPost', url, data, config),
    rawGet: async (url, config) => await request('rawGet', url, null, config),
    rawGetStream: async (url, config) => await request('rawGetStream', url, null, config),
    update: async (url, data, config) => await request('update', url, data, config),
    patch: async (url, data, config) => await request('patch', url, data, config),
    delete: async (url, config) => await request('delete', url, null, config),
    request: async options => await _request(options)
  };
};

/**
 * HTTP request wrapper.
 * @param {string} method -
 * @param {string} url -
 * @param {Object} data -
 * @param {Object} httpConfig -
 * @return {Promise<response>} HTTP response
 */
async function request(method, url, data, httpConfig) {
  const options = Object.assign({method, url}, httpConfig);
  if (data)
    options.data = data;
  return await _request(options);
}

/**
 * HTTP request internal function
 * @param {Object} options -
 * @return {Promise<response>} HTTP response
 */
async function _request(options) {
  if (!options.headers)
    options.headers = {};

  if (_clientIdUtil)
    options.headers['X-ClientId'] = await _clientIdUtil.getClientId();

  switch (options.method) {
    case 'rawPost':
      options.method = 'post';
      options.headers['Content-type'] = 'application/octet-stream';
      options.maxBodyLength = Infinity;
      options.maxContentLength = Infinity;
      break;
    case 'rawGet':
      options.method = 'get';
      options.responseType = _runtime == 'browser' ? 'blob' : 'arraybuffer';
      options.headers['Content-type'] = 'application/octet-stream';
      break;
    case 'rawGetStream':
      options.method = 'get';
      options.responseType = 'stream';
      options.headers['Content-type'] = 'application/octet-stream';
      break;
    default:
      break;
  }

  try {
    return await _http(options);
  } catch (error) {
    if (error.response) {
      _logger.debug(`HTTP ${options.method} request: ${options.baseURL}${options.url}, reply status: ${error.response.status}`);
      throw error.response;
    }
    _logger.debug(`HTTP ${options.method} request: ${options.baseURL}${options.url} errno: ${error.errno}, ${error.message}`);
    throw {status: 0, message: error.message};
  }
}
