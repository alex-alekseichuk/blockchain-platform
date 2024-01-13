import axios from 'axios';

import { Controller } from '../controller';
import { MemoryStorage } from '../storages';
import { plot } from '../plot';

const {contextUtil, digitalAssetDriver, apiUtil, digitalAssetApi} = require('ng-rt-digitalAsset-sdk');

export const test: Controller = new Controller(new MemoryStorage());

// 3 nodes cluster of server side
// export const servers = [1,2,3].map(n => {
//   const server = test.remote(`server${n}`, `https://node${n}.project.com/perf`);
//   server
//     .to('usage')
//     .periodically(100)
//     .memory()
//     .cpu();
//   return server;
// });

// local server
// export const servers = [test.remote('server', 'http://http://192.168.3.102:8443/perf')];
// servers[0]
//   .to('usage')
//   .periodically(100)
//   .memory()
//   .cpu();

export const serverEnvs = ['local'];
// export const serverEnvs = ['node1', 'node2', 'node3'];

export const digitalAssetType = 'sample_vehicle';
export const sdkServerCtxs = serverEnvs.map(serverEnv =>
  contextUtil.createClientTxContext(digitalAssetType, serverEnv));
export const servers = sdkServerCtxs.map((txContext, i) => {
  const baseUrl = txContext.serverEnvironment.serverUrl;
  const server = test.remote(serverEnvs[i], `${baseUrl}/perf`);
  server
    .to('usage')
    .periodically(100)
    .memory()
    .cpu();
  return server;
});

export async function plotServersUsage() {
  (await Promise.all(servers.map(async server => await server.getResults('usage'))))
    .forEach(results => {
      console.log('CPU usage:');
      plot.plot(results.map(r => r['cpu']));
      console.log('Memory usage (M):');
      plot.plot(results.map(r => r['memory']));
    });
}

// auth.
const authenticateWithAdminCredentials = async (txContext: any, serverEnv = 'default') => {
  let username;
  let password;

  if (txContext.serverEnvironment.adminAuth) {
    username = txContext.serverEnvironment.adminAuth.userName;
    password = txContext.serverEnvironment.adminAuth.password;
  }
  if (!username || !password)
    throw Error('Please add a valid administrator username and  password to your ' + serverEnv +
      ' environment in the ~/.project/config.json or hardcode it in examples/utils/authKeyData.js');

  try {
    let jwtToken = await apiUtil.userLogin(username, password, serverEnv);
    // txContext.jwtToken = jwtToken;
    return jwtToken;
  } catch (error) {
    if (error.statusCode && error.statusCode == 401)
      throw Error('Please add a valid administrator username and  password to your ' + serverEnv +
        ' environment in the ~/.project/config.json or hardcode it in examples/utils/authKeyData.js');
    else
      throw error;
  }
};

export const authenticateWithApplicationKey = async (txContext: any, appName = 'ng-rt-digitalAsset',
                                                     serverEnv = 'default') => {
  const pluginInfo = await digitalAssetApi.getPluginConfiguration(txContext);
  let appKey;
  if ((txContext.serverEnvironment && txContext.serverEnvironment.plugins &&
    txContext.serverEnvironment.plugins[appName] && txContext.serverEnvironment.plugins[appName].appKey))
    appKey = txContext.serverEnvironment.plugins[appName].appKey;

  if (!appKey && pluginInfo.routeValidation === true)
    throw Error('Please add a valid ' + appName + ' appKey to your to your ' + serverEnv +
      ' environment in the ~/.project/config.json or hardcode it in examples/utils/authKeyData.js');
  try {
    let jwtToken = await apiUtil.appLogin(appKey, serverEnv, appName);
    return jwtToken;
  } catch (error) {
    if (error.statusCode && error.statusCode == 401)
      throw Error('Please add a valid ' + appName + ' appKey to your to your ' + serverEnv +
        ' environment in the ~/.project/config.json or hardcode it in examples/utils/authKeyData.js');
    throw error;
  }
};

// asset definition
const driverInfo: any = {
  blockchainProvider: 'T',
  blockchainProviderVersion: '0.32.8',
  blockchainDriver: 'bdbDriver',
  blockchainDriverVersion: '3.2.0'
};
const assetDefinitionFactory = (digitalAsset: any,
                                digitalAssetDescription: any,
                                divisibleAsset = true,
                                fungibleAsset = true,
                                minAmountValue = '1', maxAmountValue = '100',
                                createTransactionAllowedBySystem = true,
                                transferOwnershipAllowedBySystem = true,
                                createTransactionAllowedByUser = true,
                                transferOwnershipAllowedByUser = true,
) => {
  let assetDefinition: any = {
    digitalAsset: digitalAsset,
    digitalAssetDescription: digitalAssetDescription,
    createTransactionAllowedBySystem: createTransactionAllowedBySystem,
    transferOwnershipAllowedBySystem: transferOwnershipAllowedBySystem,
    createTransactionAllowedByUser: createTransactionAllowedByUser,
    transferOwnershipAllowedByUser: transferOwnershipAllowedByUser,
    divisibleAsset: divisibleAsset,
    fungibleAsset: fungibleAsset,
    blockchainProvider: driverInfo.blockchainProvider,
    blockchainProviderVersion: driverInfo.blockchainProviderVersion,
    blockchainDriver: driverInfo.blockchainDriver,
    blockchainDriverVersion: driverInfo.blockchainDriverVersion
  };

  if (divisibleAsset) {
    assetDefinition.minAmountValue = minAmountValue;
    assetDefinition.maxAmountValue = maxAmountValue;
  }

  return assetDefinition;
};
const assetDefinition = assetDefinitionFactory(digitalAssetType,
  'Sample vehicle asset description', false, false);
export const ensureAssetDefinition = async (txContext:any , assetType: any) => {
  txContext.jwtToken = await authenticateWithAdminCredentials(txContext);
  try {
    const result = await digitalAssetApi.createAssetDefinition(txContext, assetDefinition);
  } catch (error) {
    // if (error.statusCode == 400 && error.message === '400 - {"msg":"An asset definition with the same name does already exist"}')
    //   logger.debug(assetType + ' already exists');
    // else
    //   logger.error(resolveErrorMessage(error));
  }
};

// get tendermint cluster nodes info
export const getClusterNodesInfo = async (txContext: any) => {
  if (!txContext.jwtToken)
    txContext.jwtToken = await await authenticateWithApplicationKey(txContext, 'ng-rt-digitalAsset');
  try {
    const res = await axios.get('/ng-rt-digitalAsset/chain/nodes', {
      baseURL: txContext.serverEnvironment.serverUrl,
      headers: {Authorization: `JWT ${txContext.jwtToken}`}
    });
    return res.data;
  } catch (error) {
  }
};

export const commonArgs = require('yargs') // eslint-disable-line
  .usage('Usage: $0 [options]')
  .option('concurrent', {
    alias: 'c',
    describe: 'Initial number of concurrent threads (workers)',
    default: 1
  })
  .option('perThread', {
    alias: 't',
    describe: 'Number of the tries per a thread',
    default: 1
  })
  .option('txMethod', {
    alias: 'x',
    type: 'string',
    describe: 'Async|Sync|Commit',
    default: 'Async'
  });
