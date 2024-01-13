'use strict';

module.exports = {
  activate: services => {
    // Attention: tendermint service must be registered BEFORE digitalAsset service as it is used inside
    services.add('bc.abci-project', require('./services/abci-project')(services));
  },

  deactivate: services => {
    services.remove('bc.abci-project');
  }
};
