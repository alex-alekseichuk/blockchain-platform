"use strict";
const tmAsset = {
  txId: "76525de1a8a7226227365913b18cf6a7853556ab962d5b4625b344223e885a3f",
  data: {name: "helloworld - sample 1 at 1556106103716", power: 10, type: "ed25519"},
  type: "tendermint_blob",
  format: {sdkVersion: "3.0", keyPairType: "Ed25519", driverType: "bdbDriver", encodeType: "base64"}
};

const tmTxData = [
  {
    txId: "76525de1a8a7226227365913b18cf6a7853556ab962d5b4625b344223e885a3f",
    txData: {
      id: "76525de1a8a7226227365913b18cf6a7853556ab962d5b4625b344223e885a3f",
      operation: "CREATE",
      outputs: [
        {
          condition: {
            details: {
              type: "ed25519-sha-256",
              public_key: "2yDPkjVAmEFdmEZ7HedU8qZMbaxcD6vA2FbuxAhWa5AK"
            },
            uri: "ni:///sha-256;VmJX7zteZqMMKANDNZ8-0wvfsRWLKL_d0lByqQfjkVA?fpt=ed25519-sha-256&cost=131072"
          },
          amount: "100",
          public_keys: [
            "2yDPkjVAmEFdmEZ7HedU8qZMbaxcD6vA2FbuxAhWa5AK"
          ]
        }
      ],
      inputs: [
        {
          fulfillment: "pGSAIB1COWlpY6KJi0lwsEXCTzlyJd1hyNeQPIThXyY5PWNkgUC6Dn-XV1zPY8OcDPuEpXi2atddRnF2NqKlNQ9GAmhY8iGcOVdan0D7skoXUUW5nRFjQFzb2X5DGBGgJERFs4gP",
          fulfills: null,
          owners_before: [
            "2yDPkjVAmEFdmEZ7HedU8qZMbaxcD6vA2FbuxAhWa5AK"
          ]
        }
      ],
      metadata: {

      },
      asset: {
        data: {
          name: "helloworld - sample 1 1557925150790",
          power: 10,
          type: "ed25519"
        }
      },
      version: "2.0"
    },
    assetType: "tendermint_blob",
    assetFormat: {
      sdkVersion: "3.0",
      keyPairType: "Ed25519",
      driverType: "bdbDriver",
      encodeType: "base64"
    },
    projectMetadata: {
      timestamp: 1557925150933,
      datetime: "2019-05-15T12:59:10Z",
      user: {
        domainId: "D01"
      }
    }
  },
  {
    txId: "d9d3b300a30289baf52607eb2ce6f409a7788ddea493cc62d56db306b0c2a8cd",
    txData: {
      id: "d9d3b300a30289baf52607eb2ce6f409a7788ddea493cc62d56db306b0c2a8cd",
      operation: "TRANSFER",
      outputs: [
        {
          condition: {
            details: {
              type: "ed25519-sha-256",
              public_key: "7dH6iWxQdfNptmNBeEUGiM4g8ayeD8Q2JLUjwvWDeb46"
            },
            uri: "ni:///sha-256;8Q2Vc1fv3H20iPxMwh48No_9Jxh8KanJHavJR72_c1s?fpt=ed25519-sha-256&cost=131072"
          },
          amount: "100",
          public_keys: [
            "7dH6iWxQdfNptmNBeEUGiM4g8ayeD8Q2JLUjwvWDeb46"
          ]
        }
      ],
      inputs: [
        {
          fulfillment: "pGSAIB1COWlpY6KJi0lwsEXCTzlyJd1hyNeQPIThXyY5PWNkgUDFj4uu97e_SbxIVrHswJ_R4Cmb5EhIA1S7aWBdbnRi_NZZhpaA6MAmBajfm0PNFig9PrVFZL9v9h4b-aeKxqAC",
          fulfills: {
            output_index: 0,
            transaction_id: "76525de1a8a7226227365913b18cf6a7853556ab962d5b4625b344223e885a3f"
          },
          owners_before: [
            "2yDPkjVAmEFdmEZ7HedU8qZMbaxcD6vA2FbuxAhWa5AK"
          ]
        }
      ],
      metadata: {

      },
      asset: {
        id: "76525de1a8a7226227365913b18cf6a7853556ab962d5b4625b344223e885a3f"
      },
      version: "2.0"
    },
    assetType: "tendermint_blob",
    assetFormat: {
      sdkVersion: "3.0",
      keyPairType: "Ed25519",
      driverType: "bdbDriver",
      encodeType: "base64"
    },
    
  }

];

const _services = {
  get: name => {
    return {
      i18n: {
        __: () => ''
      },
      loopbackApp: {
        models: {
          tmTx: {
            find: () => {
              return tmTxData;
            }
          },
          tmAsset: {
            findOne: () => {
              return tmAsset;
            }
          }
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
