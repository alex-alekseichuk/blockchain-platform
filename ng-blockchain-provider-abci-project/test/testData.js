"use strict";

const tmAsset = {
  txId: "c0bc739224634ec184be079e272ac84c17d68fdf34ce74607b565f316841d743",
  type: "tendermint_blob",
  format: {sdkVersion: "3.0", keyPairType: "Ed25519", driverType: "bdbDriver", encodeType: "base64"},
  data: {name: "helloworld - sample 1 at 1556106103716", power: 10, type: "ed25519"}
};

const tmTxData = {
  txId: "c0bc739224634ec184be079e272ac84c17d68fdf34ce74607b565f316841d743",
  txData: {id: "2da424cbae0d4cf42667dc44b73ba219fd8c6896afcd2e8f08a077b900d47ca0", operation: "CREATE", outputs: [{condition: {details: {type: "ed25519-sha-256", public_key: "2yDPkjVAmEFdmEZ7HedU8qZMbaxcD6vA2FbuxAhWa5AK"}, uri: "ni:///sha-256;VmJX7zteZqMMKANDNZ8-0wvfsRWLKL_d0lByqQfjkVA?fpt=ed25519-sha-256&cost=131072"}, amount: "100", public_keys: ["2yDPkjVAmEFdmEZ7HedU8qZMbaxcD6vA2FbuxAhWa5AK"]}], inputs: [{fulfillment: "pGSAIB1COWlpY6KJi0lwsEXCTzlyJd1hyNeQPIThXyY5PWNkgUDYyZnrkzxdQHCDbpqeCUWDMA8AA1az0P22s0Bzzb2HuGihWxizodQulbuu1sNmSZEqGFI_8A7YCBAvMzh_cmAP", fulfills: null, owners_before: ["2yDPkjVAmEFdmEZ7HedU8qZMbaxcD6vA2FbuxAhWa5AK"]}], version: "2.0"}
};

const _services = {
  get: name => {
    return {
      i18n: {
        __: () => ''
      },
      'metricsClient': {
        increment: () => {
        }
      },
      loopbackApp: {
        models: {
          tmTx: {
            find: () => {
              return [tmTxData];
            }
          },
          tmAsset: {
            findOne: () => {
              return tmAsset;
            }
          }
        }
      },
      'abci-client': {
          getTxById: () => {
              return tmTxData;
          },
          getAssetById: () => {
              return tmAsset;
          }
      }
    }[name] || {};
  }
};

const requestData = {
  publicKey: "2yDPkjVAmEFdmEZ7HedU8qZMbaxcD6vA2FbuxAhWa5AK",
  assetType: "tendermint_blob"
};

module.exports = {
  _services,
  requestData
};
