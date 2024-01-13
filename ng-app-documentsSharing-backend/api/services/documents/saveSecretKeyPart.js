"use strict";
const logger = require('log4js').getLogger('ng-app-documentsSharing/nsi/saveSecretKeyPart');
const request = require('request');

/**
 * @type {service}
 * @param {Object} services - service's scope
 * @param {String} contractId - the id of contract
 * @param {String} pubKey - public key of user
 * @param {String} federationNodeAddress - address of federation node to get key part from
 * @param {String} keyPart - encrypted part of the key
 * @param {Object} timeout - timeout
 * @param {Function} __callback - Callback
 */
module.exports = (services, contractId, pubKey, federationNodeAddress, keyPart, timeout, __callback) => {
  logger.debug("contractId:", contractId);

  const configService = services.get('configService');
  const keyPair = configService.get('scKeypair');

  let url = `${configService.get('https') ? 'https' : 'http'}://` +
    federationNodeAddress + "/ng-rt-smartContracts/contracts/app/call/" + contractId +
    "/give_access";

  logger.debug("URL:", url);

  request.post({
    url: url,
    method: 'POST',
    form: {
      args: JSON.stringify([keyPair.public, keyPart, timeout]),
      privKey: keyPair.private,
      pubKey: keyPair.public
    }
  }, (error, response, body) => {
    if (error) {
      return __callback({error: error});
    }

    try {
      logger.debug('body', body);

      __callback('OK');
    } catch (e) {
      logger.error("smart contracts response error:");
      logger.error(e);
      __callback({error: e});
    }
  });
};
