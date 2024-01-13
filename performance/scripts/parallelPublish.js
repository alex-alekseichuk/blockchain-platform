// multi processes
'use strict';
const cluster = require('cluster');
const numChild = require('os').cpus().length;

const logger = require('log4js').getLogger('ng-rt-digitalAsset-sdk.scripts.massDataPublish');
const {publishContract, getPluginConfiguration} = require('ng-rt-smartContracts-driver');
const {contextUtil, apiUtil} = require('ng-rt-digitalAsset-sdk');

const templateName = ['SC_HelloWorld_Part1', 'SC_HelloWorld_Part2'];
const args = ['Hello World', 'Hello', 'Hi, i am Here'];
let contractIds = [];
const publisherKeyPair = {
  privateKey: 'Db1mbaoCxmcqvkRCL3aDHmR18UDx3rViDecNMzmRAD77',
  publicKey: '3PtBLYHY9n3KEr5KeSQ5RQiQXGUkesa6Vvqvk3KTEfN3'
};

logger.level = 'info';

if (cluster.isMaster) {
	// publish function to be executed again in child mode
  logger.info('this is master process: ', process.pid);
  logger.info('numChild: ', numChild);
  for (let i = 0; i < numChild; i++) {
    cluster.fork();
  }
} else {
	// Publishes a smartcontract on TBSP
  const publish = async function(templateName, publisherKeyPair, args) {
    try {
      logger.info('Fetching data...');
      const clientSigning = false;
      const serverEnv = 'default';
      const digitalAssetType = 'smartContract';
      const txContext = contextUtil.createClientTxContext(digitalAssetType, serverEnv, 'ng-rt-smartContracts');

			// If routeValidation is on
      let result = await getPluginConfiguration(txContext);
      if (result.routeValidation == true) {
        const appKey = txContext.serverEnvironment.appKey;
        const jwtToken = await apiUtil.appLogin(appKey, 'default', 'ng-rt-smartContracts');
        txContext.jwtToken = jwtToken;
      }

			// start time
      const start = Date.now();
      logger.info(`Start time: ${start}`);
      const message = `worker: ${process.pid}`;
      logger.info(message);

      const publishedContractTx = await publishContract(
				txContext,
				publisherKeyPair.publicKey,
				clientSigning,
				templateName,
				args
			);
      const contractId = publishedContractTx;
      contractIds.push(contractId);

      logger.info(`Smart Contract published successfully`);
      logger.info(`Contract id: ${contractId}`);
			// end time
      const end = Date.now() - start;
      logger.info(`Execution time: ${end}`);
    } catch (error) {
      logger.error(error.message);
    }
  };

  publish(
		templateName[Math.floor(Math.random() * templateName.length)],
		publisherKeyPair,
		args[Math.floor(Math.random() * args.length)]
	);
}
