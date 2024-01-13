"use strict";
const tmAssets = [
    {
        txId : "5701a0d48d152967cb8a4a33ba68d6ecbe29f64c7c480e4ef66c6472670f108a",
        type : "tendermint_blob",
        format : {
            sdkVersion : "3.0",
            keyPairType : "Ed25519",
            driverType : "bdbDriver",
            encodeType : "base64"
        },
        data : {
            serialNumber : "56288320528682648929801",
            Type : "car",
            modelName : "BMW x",
            registrationYear : "2019",
            colour : "black",
            numberOfDoors : "3",
            fueltype : "Diesel",
            time : "1561971470219"
        }
    },
    {
        txId : "c3c1b2a3317fd6714972714b0630721026772e59766355b6ebdad3ac1e1fd1ef",
        type : "tendermint_blob",
        format : {
            sdkVersion : "3.0",
            keyPairType : "Ed25519",
            driverType : "bdbDriver",
            encodeType : "base64"
        },
        data : {
            "id" : "5701a0d48d152967cb8a4a33ba68d6ecbe29f64c7c480e4ef66c6472670f108a"
        }
    },
    {
        txId : "e65e0e56123bd087c8febc75f620c26925084ea6ac4eeb0539f78e2ba6822d2e",
        type : "tendermint_blob",
        format : {
            sdkVersion : "3.0",
            keyPairType : "Ed25519",
            driverType : "bdbDriver",
            encodeType : "base64"
        },
        data : {
            serialNumber : "56288320528682648929801",
            Type : "car",
            modelName : "BMW x",
            registrationYear : "2019",
            colour : "black",
            numberOfDoors : "3",
            fueltype : "Diesel",
            time : "1562053828020"
        }
    }
];
const tmAsset = {
    txId : "5701a0d48d152967cb8a4a33ba68d6ecbe29f64c7c480e4ef66c6472670f108a",
    type : "tendermint_blob",
    format : {
        sdkVersion : "3.0",
        keyPairType : "Ed25519",
        driverType : "bdbDriver",
        encodeType : "base64"
    },
    data : {
        serialNumber : "56288320528682648929801",
        Type : "car",
        modelName : "BMW x",
        registrationYear : "2019",
        colour : "black",
        numberOfDoors : "3",
        fueltype : "Diesel",
        time : "1561971470219"
    }
}

const tmTx = [
    {
                
        txId : "5701a0d48d152967cb8a4a33ba68d6ecbe29f64c7c480e4ef66c6472670f108a",
        txData : {
            id : "5701a0d48d152967cb8a4a33ba68d6ecbe29f64c7c480e4ef66c6472670f108a",
            operation : "CREATE",
            outputs : [ 
                {
                    condition : {
                        details : {
                            type : "ed25519-sha-256",
                            public_key : "3PtBLYHY9n3KEr5KeSQ5RQiQXGUkesa6Vvqvk3KTEfN3"
                        },
                        uri : "ni:///sha-256;caXnLa0M6tsPBjCLAK5Zm9RahUlyVBVoGs8PfQnw0Z4?fpt=ed25519-sha-256&cost=131072"
                    },
                    amount : "1",
                    public_keys : [ 
                        "3PtBLYHY9n3KEr5KeSQ5RQiQXGUkesa6Vvqvk3KTEfN3"
                    ]
                }
            ],
            inputs : [ 
                {
                    fulfillment : "pGSAICOUBOCifUxKqLuoms1l0OPjYFsr0czztsFHPedBO24EgUDetwU2_KO_eezv6A_AoTT2sW_GVEQQIuo-s3-X2Uptetrhx1Rcl9_qoXaf7xfbxhGzBgVr9RTF8BR_jPexVnoI",
                    fulfills : null,
                    owners_before : [ 
                        "3PtBLYHY9n3KEr5KeSQ5RQiQXGUkesa6Vvqvk3KTEfN3"
                    ]
                }
            ],
            metadata : {},
            asset : {
                data : {
                    serialNumber : "56288320528682648929801",
                    Type : "car",
                    modelName : "BMW x",
                    registrationYear : "2019",
                    colour : "black",
                    numberOfDoors : "3",
                    fueltype : "Diesel",
                    time : "1561971470219"
                }
            },
            version : "2.0"
        },
        txMetadata : {
            timestamp : 1561971470347.0,
            datetime : "2019-07-01T08:57:50Z",
            user : {
                applicationId : "ng-rt-digitalAsset",
                domainId : "",
                roles : [ 
                    "admin"
                ]
            }
        }
    },
    {
        txId : "c3c1b2a3317fd6714972714b0630721026772e59766355b6ebdad3ac1e1fd1ef",
        txData : {
            id : "c3c1b2a3317fd6714972714b0630721026772e59766355b6ebdad3ac1e1fd1ef",
            operation : "TRANSFER",
            outputs : [ 
                {
                    condition : {
                        details : {
                            type : "ed25519-sha-256",
                            public_key : "GYJSQ26pB24mwafXbMLpsjgD3QLS8oaKbjmnSPbiWBWB"
                        },
                        uri : "ni:///sha-256;la04J_P9gxWeaxaWNw6EkIyEFRxjkZENbqFTBeRv11g?fpt=ed25519-sha-256&cost=131072"
                    },
                    amount : "1",
                    public_keys : [ 
                        "GYJSQ26pB24mwafXbMLpsjgD3QLS8oaKbjmnSPbiWBWB"
                    ]
                }
            ],
            inputs : [ 
                {
                    fulfillment : "pGSAICOUBOCifUxKqLuoms1l0OPjYFsr0czztsFHPedBO24EgUDHxkcw7WzsOHZ8uYh0s4lS-OSdTRz6d9V40yBoPxC0IaReC9U-lPwbr-xun7TsKa6hyM43V1eMZYX5zl-xSqYG",
                    fulfills : {
                        output_index : 0,
                        transaction_id : "5701a0d48d152967cb8a4a33ba68d6ecbe29f64c7c480e4ef66c6472670f108a"
                    },
                    owners_before : [ 
                        "3PtBLYHY9n3KEr5KeSQ5RQiQXGUkesa6Vvqvk3KTEfN3"
                    ]
                }
            ],
            metadata : {},
            asset : {
                "id" : "5701a0d48d152967cb8a4a33ba68d6ecbe29f64c7c480e4ef66c6472670f108a"
            },
            version : "2.0"
        },
        txMetadata : {
            timestamp : 1561971470771.0,
            datetime : "2019-07-01T08:57:50Z",
            user : {
                applicationId : "ng-rt-digitalAsset",
                domainId : "",
                roles : [ 
                    "admin"
                ]
            }
        }
    },
    {
        txId : "e65e0e56123bd087c8febc75f620c26925084ea6ac4eeb0539f78e2ba6822d2e",
        txData : {
            id : "e65e0e56123bd087c8febc75f620c26925084ea6ac4eeb0539f78e2ba6822d2e",
            operation : "CREATE",
            outputs : [ 
                {
                    condition : {
                        details : {
                            type : "ed25519-sha-256",
                            public_key : "2SRYD7njZV28cWtN8b6hioDrftUXKemDY6v2wuoWZrAW"
                        },
                        uri : "ni:///sha-256;RJAJ-2Cy7Ynh-CE-LBArtOyNq6k31x4KUQ_MYrcflzQ?fpt=ed25519-sha-256&cost=131072"
                    },
                    amount : "1",
                    public_keys : [ 
                        "2SRYD7njZV28cWtN8b6hioDrftUXKemDY6v2wuoWZrAW"
                    ]
                }
            ],
            inputs : [ 
                {
                    fulfillment : "pGSAICOUBOCifUxKqLuoms1l0OPjYFsr0czztsFHPedBO24EgUD2zCLP3npAJneouB5ts6mj7Wt0-plJ2F6dDq1s03otWS4SPoOqtvqcuo5gzoc79qkN7RikPrb1UMvCkhshg5AE",
                    fulfills : null,
                    owners_before : [ 
                        "2SRYD7njZV28cWtN8b6hioDrftUXKemDY6v2wuoWZrAW"
                    ]
                }
            ],
            metadata : {},
            asset : {
                data : {
                    serialNumber : "56288320528682648929801",
                    Type : "car",
                    modelName : "BMW x",
                    registrationYear : "2019",
                    colour : "black",
                    numberOfDoors : "3",
                    fueltype : "Diesel",
                    time : "1562053828020"
                }
            },
            version : "2.0"
        },
        txMetadata : {
            timestamp : 1562053828234.0,
            datetime : "2019-07-02T07:50:28Z",
            user : {
                applicationId : "ng-rt-digitalAsset",
                domainId : "",
                roles : [ 
                    "admin"
                ]
            }
        }
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
              return tmTx;
            }
          },
          tmAsset: {
            find: () => {
                return tmAssets;
              },
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
  publicKey: "GYJSQ26pB24mwafXbMLpsjgD3QLS8oaKbjmnSPbiWBWB",
  assetType: "tendermint_blob"
};

module.exports = {
  _services,
  requestData
};
