/**
 * API for obtaining wallet/address public info.
 * It's provided by ng-demo-transaction.
 * It's not used for now.
 */
'use strict';

module.exports = function apiWallet(config, sessionHttp) {
  const httpConfig = config.api.demoTx;
  return {
    getWalletByEmail: async email =>
      (await sessionHttp.post('/ng-demo-transaction/pubkeyByEmail', {email}, httpConfig)).data
  };
};
