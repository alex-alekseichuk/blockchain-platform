/**
 * Get permanent unique client id.
 * It's saved in the storage.
 */
'use strict';

const generateId = require('./util').generateShortId;
let _storage;

/**
 * Generate unique ID.
 * @return {Promise<string>} unique in terms of microseconds short string id
 */
async function getClientId() {
  let clientId = await _storage.get('clientId');
  if (!clientId) {
    clientId = generateId();
    _storage.save('clientId', clientId);
  }
  return clientId;
}

module.exports = function clientIdUtil(storage) {
  _storage = storage;
  return {
    getClientId
  };
};
