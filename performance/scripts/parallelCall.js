// multi processes
'use strict';
const cluster = require('cluster');
const numChild = require('os').cpus().length;

const logger = require('log4js').getLogger('ng-rt-digitalAsset-sdk.scripts.massDataPublish');
const {callContractFunction, getPluginConfiguration} = require('ng-rt-smartContracts-driver');
const {contextUtil, apiUtil} = require('ng-rt-digitalAsset-sdk');
// var csv = require('ya-csv');
const parse = require('csv-parse');
const fs = require('fs');
const filename = './1.csv';

let contractIds = [];
const functionName = 'getGreeting';
const args = ['false'];
const clientSigning = false;
const serverEnv = 'default';
let assetType = 'smartContract';
let assetAmount = 1;
const digitalAssetType = 'smartContract';

const callerKeypair = {
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
  fs
		.createReadStream(filename)
		.pipe(parse({delimiter: ','}))
		.on('data', r => {
			// console.log(r);
  contractIds.push(r[0]);
})
		.on('end', async () => {
			// console.log(contractIds);

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
  const contractId = contractIds[Math.floor(Math.random() * contractIds.length)];
  const response = await callContractFunction(
				txContext,
				callerKeypair.publicKey,
				clientSigning,
				contractId,
				functionName,
				assetType,
				assetAmount,
				args
			);

  logger.info(response);
			// end time
  const end = Date.now() - start;
  logger.info(`Execution time: ${end}`);
});
}
