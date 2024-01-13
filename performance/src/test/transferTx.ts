/**
 * Transfer TX performance test.
 * It loads the set of source txId's from createTx-client.txId
 * It loads the server/cluster with a lot of transfer tx simultaneously.
 * It saves all txId's into transferTx-client.txId
 * Usage:
 *  npx ts-node src/test/transferTx.ts --concurrent=5 --perThread=3
 *
 *  split -l 1 -d createTx-client.csv
 *  for x in 01 02 03 04 05 06 07 08 09 10 11 12 13 14 15; do cat x00 > y$x;cat x$x >> y$x;done
 *  for x in 01 02 03 04 05 06 07 08 09 10 11 12 13 14 15; do npx ts-node src/test/transferTx.ts --txFile=./y$x &; done
 */
import { loadColumn, loadMetric, runConcurrently } from '../util';

const {digitalAssetDriver} = require('ng-rt-digitalAsset-sdk');
import { plot } from '../plot';
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

  const total = args.concurrent * args.perThread;

  const txIdsFile = args.txFile || './createTx-client.csv';
  const txIds: Array<string> = await loadColumn(txIdsFile, 'txId');

  if (total > txIds.length) {
    console.error(`${txIds.length} records in ${txIdsFile} is not enough for ${total} source tx it needs.`);
    return;
  }

  await ensureAssetDefinition(sdkServerCtxs[0], digitalAssetType);

  await Promise.all(sdkServerCtxs.map(sdkCtx => authenticateWithApplicationKey(sdkCtx).then(token => {
    sdkCtx.jwtToken = token;
    sdkCtx.txMethod = args.txMethod;
  })));

  const alice = {
    name: 'Alice',
    lastname: 'Wonderland',
    privateKey: 'Db1mbaoCxmcqvkRCL3aDHmR18UDx3rViDecNMzmRAD77',
    publicKey: '3PtBLYHY9n3KEr5KeSQ5RQiQXGUkesa6Vvqvk3KTEfN3'
  };
  const bob = {
    name: 'Bob',
    lastname: 'Marley',
    privateKey: "149u6rWYs7JgRbQZUuLigbjisf1yx5UkvKk3toutpTqf",
    publicKey: "GYJSQ26pB24mwafXbMLpsjgD3QLS8oaKbjmnSPbiWBWB"
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
  // const amount = '1';
  const txMetadata: any = {};

  await test.start();
  await runConcurrently(args.concurrent, args.perThread, async (worker: any) => {
    worker.clientTimer = test.to('client').manually().timer();
  },async (worker: any, i: number) => {
    const txContext = sdkServerCtxs[i % sdkServerCtxs.length];
    worker.clientTimer.startTimer();
    let txId = null;
    try {
      const transferTxResult = await digitalAssetDriver.transferDigitalAsset(txContext, txIds[i], txMetadata, alice.publicKey, alice.privateKey, bob.publicKey);
      txId = transferTxResult.result.hash;
    } catch (err) {
      console.error(err);
    }
    if (txId) {
      worker.clientTimer.record({txId});
    } else {
      worker.clientTimer.stopTimer();
    }
  });
  await test.stop();

  // draw plots of results to stdout
  const timerResults = test.storage.getResults('client');
  if (timerResults) {
    console.log('Time spent for posting TRANSFER tx (ms):');
    plot.plot(timerResults.map(r => r['timer']));
  }
  await plotServersUsage();

  await test.saveCsv('transferTx-');
})();
