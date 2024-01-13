/**
 * Wait for TX performance test.
 * 1. Establish `concurrent` connections
 * 2. per each perThread times compose/sign TX
 *      start_i()
 *      wait_i()
 *      post_i()
 * 3. when wait_i is done
 *      stop_i()
 * Usage:
 *  npx ts-node src/test/waitTx.ts --concurrent=5 --perThread=5 --websocket
 */
const {digitalAssetDriver, digitalAssetApi} = require('ng-rt-digitalAsset-sdk');

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

const {common, nodejs} = require('ng-common');

(async function() {
  const args = commonArgs
    .option('verbose', {
      alias: 'v',
      type: 'boolean',
      describe: 'Turn on logger output'
    })
    .option('websocket', {
      alias: 'w',
      type: 'boolean',
      describe: 'Number of the listeners'
    })
    .argv;

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

  const waitCtxs = Array(args.concurrent).fill(null).map((x, i) => {
    const sdkCtx = sdkServerCtxs[i % sdkServerCtxs.length];
    const client = nodejs.cli.createContext()
      .reg(common.logger, {appender: args.verbose ? common.logger.consoleAppender : common.logger.noneAppender})
      .reg(nodejs.cli.storage)
      .reg(common.clientIdUtil)
      .reg(common.http.axiosClientHttp);
    if (!client) {
      process.exit(1);
    }
    const serverSettings = sdkCtx.serverEnvironment;
    client.config = {
      websocket: {
        enabled: args.websocket,
        url: serverSettings.websocket.url
      },
      api: {
        blockchain: {baseURL: `${serverSettings.serverUrl}/apiBlockchain/`}
      }
    };
    if (args.websocket) {
      client.reg(nodejs.websocket);
    } else {
      client.txContext = sdkCtx;
      client.reg(common.session.txContextHttp);
    }
    // use wait-ws part of blockchain
    client.reg(common.api.apiBlockchain);
    client.reg(common.blockchain);

    return client;
  });

  if (args.websocket) {
    let nConnected = 0;
    waitCtxs.forEach(app => {
      app.websocket.on('open', async () => {
        nConnected ++;
        if (nConnected === waitCtxs.length) {
          await runTest();
        }
      });
      app.websocket.open();
    });
  } else {
    await runTest();
  }

  const ASSET_FORMAT = digitalAssetDriver.getSdkInfo();

  async function runTest() {
    await test.start();
    await runConcurrently(args.concurrent, args.perThread, null,async (worker: any, i: number) => {
      const clientTimer = test.to('client').manually().timer();
      const waitCtx = waitCtxs[worker.i];
      const sdkCtx = sdkServerCtxs[i % sdkServerCtxs.length];
      const time = Date.now().toString();
      const rand = time + Math.random();
      return new Promise<void>(async resolve => {
        clientTimer.startTimer();
        try {
          const data = Object.assign({}, digitalAssetData, {time, rand});
          const signedTx = digitalAssetDriver.composeAndSignCreateTx(data, amount, txMetadata, alice.publicKey,
            alice.privateKey);
          waitCtx.apiBlockchain.waitTx(signedTx.id/*, record.timestamp*/).then((res: any) => {
            if (res && res.id)
              clientTimer.record({txId: res.id});
            else
              clientTimer.stopTimer();
            resolve();
          });
          const createDaResponse = await digitalAssetApi.postSignedCreateTx(sdkCtx, signedTx, alice.publicKey,
            ASSET_FORMAT);
          if (!createDaResponse) {
            clientTimer.stopTimer();
            resolve();
          }
        } catch {
          clientTimer.stopTimer();
          resolve();
        }
      });
    });
    await stopAll();
  }

  async function stopAll() {
    await test.stop();

    if (args.websocket)
      waitCtxs.forEach(app => app.websocket.close());

    // draw plots of results to stdout
    const timerResults = test.storage.getResults('client');
    if (timerResults) {
      console.log('Time spent for waiting (ms):');
      plot.plot(timerResults.map(r => r['timer']));
    }
    await plotServersUsage();

    await test.saveCsv('waitTx-');

    process.exit();
  }
})();
