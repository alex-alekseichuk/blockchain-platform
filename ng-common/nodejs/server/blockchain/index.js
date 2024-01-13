/**
 * There are modules for blockchain implementation on server side.
 * 1. Frontend: Http route handlers, Websocket listeners
 * 2. Service: blockchain, blockchainListen
 * 3. Backend: blockchainStorage, blockchainCache
 */
'use strict';
module.exports = {
  // fronted
  blockchainListenWs: require('./blockchainListenWs'),
  blockchainListRoutes: require('./blockchainListRoutes'),

  // service
  blockchainList: require('./blockchainList'),

  // backend
  memoryStorage: require('./memoryStorage'),
  memoryCache: require('./memoryCache'),
  mongodbCache: require('./mongodbCache')
};
