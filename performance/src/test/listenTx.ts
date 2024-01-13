/**
 * Listen TX performance test.
 * 1. Open N tx listeners
 * 2. for (counter * perThread)
 *      start_1()
 *      count_1 = 0
 *      createTx_1()
 * 3. when (counter_i++) == N
 *      stop_i()
 * Usage:
 *  npx ts-node src/test/listenTx.ts --concurrent=5 --perThread=5 --listeners=10 --websocket
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

const {common, nodejs} = require('ng-common');

(async function() {
  const args = commonArgs
    .option('verbose', {
      alias: 'v',
      type: 'boolean',
      describe: 'Turn on logger output'
    })
    .option('listeners', {
      alias: 'l',
      describe: 'Number of the listeners',
      default: 1
    })
    .option('websocket', {
      alias: 'w',
      type: 'boolean',
      describe: 'Number of the listeners'
    })
    .argv;

  const nTotalTx = args.concurrent * args.perThread;
  let nTxDone: number = 0;

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

  const listenCtxs = Array(args.listeners).fill(null).map((x, i) => {
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
    // use listen-ws part of blockchain
    client.reg(common.api.apiBlockchain);
    client.reg(common.blockchain);

    return client;
  });

  const createTxScopes: any = {};

  if (args.websocket) {
    let nConnected = 0;
    listenCtxs.forEach(app => {
      app.websocket.on('open', async () => {
        nConnected ++;
        if (nConnected === listenCtxs.length) {
          await listenAll();
        }
      });
      app.websocket.open();
    });
  } else {
    await listenAll();
  }

  let listeners: Array<any>;
  async function listenAll() {
    listeners = await Promise.all(listenCtxs.map(listenCtx => listen(listenCtx)));
    await runTest();
  }

  async function listen(app: any) {
    return app.blockchain.listenTx({}, (tx: any) => {
      const flatTx = common.util.flatten(tx);
      const createTxContext = createTxScopes[flatTx.rand];
      if (createTxContext) {
        createTxContext.counter++;
        if (createTxContext.counter === args.listeners) {
          createTxContext.clientTimer.record({txId: createTxContext.txId});
          nTxDone++;
          if (nTxDone >= nTotalTx)
            stopAll();
          else
            createTxContext.resolve();
        }
      }
    });
  }

  async function runTestExit() {
    setTimeout(async () => {
      listeners.forEach(listener => listener.close());
      if (args.websocket)
        listenCtxs.forEach(app => app.websocket.close());

      process.exit();
    }, 1000);
  }

  async function runTest() {
    await test.start();
    await runConcurrently(args.concurrent, args.perThread, null, (worker: any, i: number) => {
      const clientTimer = test.to('client').manually().timer();
      const sdkCtx = sdkServerCtxs[i % sdkServerCtxs.length];
      const time = Date.now().toString();
      const rand = time + Math.random();
      return new Promise<void>(async resolve => {
        const createTxContext: any = {clientTimer, counter: 0, resolve};
        createTxScopes[rand] = createTxContext;
        clientTimer.startTimer();
        try {
          const data = Object.assign({}, digitalAssetData, {time, rand});
          const createTxScope = await digitalAssetDriver.createDigitalAsset(sdkCtx, data, amount,
            txMetadata, alice.publicKey, alice.privateKey);
          if (createTxScope) {
            createTxContext.txId = createTxScope.result.hash;
          }
        } catch {
        }
        if (!createTxContext.txId) {
          clientTimer.stopTimer();
          delete createTxScopes[rand];
          resolve();
        }
      });
    });
  }

  async function stopAll() {
    await test.stop();

    listeners.forEach(listener => listener.close());
    if (args.websocket)
      listenCtxs.forEach(app => app.websocket.close());

    // draw plots of results to stdout
    const timerResults = test.storage.getResults('client');
    if (timerResults) {
      console.log('Time spent on listening (ms):');
      plot.plot(timerResults.map(r => r['timer']));
    }
    await plotServersUsage();

    await test.saveCsv('listenTx-');

    process.exit();
  }
})();
