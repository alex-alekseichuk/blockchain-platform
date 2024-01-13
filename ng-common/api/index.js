'use strict';

/**
 * There are API's available via HTTP.
 * Most of them require authenticated and authorized access.
 */
module.exports = {
  util: require('./util'),

  apiConfig: require('./apiConfig'),
  apiFiles: require('./apiFiles'),
  apiBlockchain: require('./apiBlockchain')
};
