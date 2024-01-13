/**
 * Main server file
 */
const {common, nodejs} = require('ng-common');

(async function() {
  const app = common.context.create();

  // hardcoded config
  app.config = {
    http: {
      address: 'localhost',
      port: 3000,
      secure: false,
      websocket: {
        enabled: true
      }
    }
  };

  app.reg(common.logger);
  app.reg(require('./services/domains'));
  app.reg(require('./http/httpServer'));
  app.reg(nodejs.server.listenController);
  app.inject(require('./http/configRoutes'));

  // http context
  app.reg(require('./http/dummyHttpContext'));

  // auth.
  app.reg(require('./auth/dummyAuthService'));
  app.inject(require('./auth/authRoutes'));

  // file upload/download system
  await app.regAsync(require('./file/localFileStorage'));
  app.reg(require('./file/fileService'));
  app.inject(require('./file/fileRoutes'));

  // blockchain system
  app.reg(nodejs.server.blockchain.memoryStorage);
  app.reg(nodejs.server.blockchain.mongodbCache);
  app.reg(require('./blockchain/blockchain'));
  app.reg(nodejs.server.blockchain.blockchainList);
  app.inject(require('./blockchain/blockchainRoutes'));
  app.inject(nodejs.server.blockchain.blockchainListRoutes);
  app.reg(nodejs.server.blockchain.blockchainListenWs);
  app.blockchain.on('tx', app.blockchainListenWs.notify);

  // dummy blockchain implementation
  const dummyBlockchain = app.inject(common.blockchain.dummy.server);
  app.blockchainSetup.regBlockchain('dummy', dummyBlockchain);

  // demo domain: tx-app
  app.blockchainSetup.regDaType('demo', dummyBlockchain);
  app.domainsSetup.regDomain('demo', {daType: 'demo'});

  // require('performance').routes(app.httpServer);
})();
