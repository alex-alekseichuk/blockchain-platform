/**
 * Publish SC instance performance test.
 * It publishes a lot of SC instances simultaneously.
 * Save all scId's into publishSc-client.txId
 * Usage:
 *  npx ts-node src/test/publishSc.ts --concurrent=5 --perThread=5
 */
const configService = require('ng-configservice');
const {digitalAssetDriver, contextUtil, apiUtil, digitalAssetApi} = require('ng-rt-digitalAsset-sdk');
const { publishContract } = require('ng-rt-smartContracts-driver');
const driver = require('ng-rt-digitalasset-driver')();

import { plot } from '../plot';
import { runConcurrently } from '../util';

import {
  commonArgs,
  test,
  plotServersUsage,
  serverEnvs,
} from './common';

(async function() {
  const args = commonArgs.argv;

  const digitalAssetType = 'smartContract';
  const templateName = 'SC_HelloWorld_Part1';
  const scArgs = 'Hello';
  const clientSigning = true;

  const serverEnv = configService.get(`env:default`);
  const pub = configService.get(`env:${serverEnv}:keypair:public`);
  const priv = configService.get(`env:${serverEnv}:keypair:private`);

  let scCtxs = await Promise.all(serverEnvs.map(async (serverEnv) => {
    const ctx = contextUtil.createClientTxContext(digitalAssetType, serverEnv, 'ng-rt-smartContracts');
    const appKey = ctx.serverEnvironment.appKey;
    ctx.jwtToken = await apiUtil.appLogin(appKey, 'default', 'ng-rt-smartContracts');
    return ctx;
  }));

  let daCtxs = await Promise.all(serverEnvs.map(async (serverEnv) => {
    const ctx = contextUtil.createClientTxContext(digitalAssetType, serverEnv);
    const appKey = ctx.serverEnvironment.appKey;
    ctx.jwtToken = await apiUtil.appLogin(appKey, 'default');
    return ctx;
  }));

  const assetFormat = driver.getSdkInfo();

  await test.start();
  await runConcurrently(args.concurrent, args.perThread, async (worker: any) => {
    worker.clientTimer = test.to('client').manually().timer();
  },async (worker: any, i: number) => {
    worker.clientTimer.startTimer();
    try {
      const unSignedTx = await publishContract(scCtxs[i % scCtxs.length], pub, clientSigning, templateName,
        `${scArgs}-${i}`);
      const signedTx = digitalAssetDriver.signTx(unSignedTx, priv);
      const response = await digitalAssetApi.postSignedCreateTx(daCtxs[i % daCtxs.length], signedTx, pub,
        assetFormat);
      const contractId = response.result.hash;
      worker.clientTimer.record({contractId});
    } catch (err) {
      console.error(err);
      worker.clientTimer.stopTimer();
    }
  });
  await test.stop();

  // draw plots of results to stdout
  const timerResults = test.storage.getResults('client');
  if (timerResults) {
    console.log('Time spent for publishing the smart contract (ms):');
    plot.plot(timerResults.map(r => r['timer']));
  }
  await plotServersUsage();

  await test.saveCsv('publishSc-');
})();
