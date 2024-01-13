/**
 * Create TX performance test.
 * It loads the server/cluster with a lot of createTx simultaneously.
 * Save all txId's into createTx-client.txId
 * Usage:
 *  npx ts-node src/test/createTx.ts --concurrent=5 --perThread=3
 */
const {digitalAssetDriver} = require('ng-rt-digitalAsset-sdk');

import { plot } from '../plot';
import { runConcurrently } from '../util';

import {
  commonArgs,
  test,
  plotServersUsage,
  authenticateWithApplicationKey,
  ensureAssetDefinition,
  sdkServerCtxs, digitalAssetType
} from './common';

(async function() {
  const args = commonArgs.argv;

  await ensureAssetDefinition(sdkServerCtxs[0], digitalAssetType);

  await Promise.all(sdkServerCtxs.map(txContext => authenticateWithApplicationKey(txContext).then(token => {
    txContext.jwtToken = token;
    txContext.txMethod = args.txMethod;
  })));

  const alice = {
    name: 'Alice',
    lastname: 'Wonderland',
    privateKey: 'Db1mbaoCxmcqvkRCL3aDHmR18UDx3rViDecNMzmRAD77',
    publicKey: '3PtBLYHY9n3KEr5KeSQ5RQiQXGUkesa6Vvqvk3KTEfN3'
  };
  const digitalAssetData: any = {
    serialNumber: '56288428682648929801',
    type: 'car',
    modelName: 'BMW x',
    registrationYear: '2019',
    colour: 'black',
    numberOfDoors: '3',
    fuelType: 'Diesel'
  };
  const amount = '1';
  const txMetadata: any = {};

  await test.start();
  await runConcurrently(args.concurrent, args.perThread, async (worker: any) => {
    worker.clientTimer = test.to('client').manually().timer();
  },async (worker: any, i: number) => {
    const txContext = sdkServerCtxs[i % sdkServerCtxs.length];
    worker.clientTimer.startTimer();
    let txId = null;
    try {
      const data = Object.assign({}, digitalAssetData, {
        time: Date.now().toString(),
        rand: Math.random()
      });
      const createTxResult = await digitalAssetDriver.createDigitalAsset(txContext, data, amount,
        txMetadata, alice.publicKey, alice.privateKey);
      if (createTxResult)
        txId = createTxResult.result.hash;
    } catch (err) {
      // console.error(err);
    }
    if (txId)
      worker.clientTimer.record({txId});
    else
      worker.clientTimer.stopTimer();
  });
  await test.stop();

  // draw plots of results to stdout
  const timerResults = test.storage.getResults('client');
  if (timerResults) {
    console.log('Time spent for posting CREATE tx (ms):');
    plot.plot(timerResults.map(r => r['timer']));
  }
  await plotServersUsage();

  await test.saveCsv('createTx-');
})();
