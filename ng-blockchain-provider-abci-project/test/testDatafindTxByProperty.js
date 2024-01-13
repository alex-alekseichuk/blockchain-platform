"use strict";
const tmMetadata = [
    {
        txId : "3c8a0f00f1ad2c50c3b3979a781a52f576a4db510137242894fb0f96c905c0a3",
        client : {
            clientId : "test"
        },
        project : {
            timestamp : 1563194792610.0,
            datetime : "2019-07-15T12:46:32Z",
            user : {
                domainId : "d01"
            }
        }
    },
    {
        txId : "752177fe9981203675f2b721aad14dc9ab2de662f5f93dfa9ecefb05903bf59c",
        client : {
            clientId : "test",
            color : "black"
        },
        project : {
            timestamp : 1563197233127.0,
            datetime : "2019-07-15T13:27:13Z",
            user : {
                domainId : "d01"
            }
        }
    }
   
];

const tmAsset = [
    {
        txId : "3c8a0f00f1ad2c50c3b3979a781a52f576a4db510137242894fb0f96c905c0a3",
        type : "tendermint_blob",
        format : {
            sdkVersion : "3.0",
            keyPairType : "Ed25519",
            driverType : "bdbDriver",
            encodeType : "base64"
        },
        data : {
            serialNumber : "56288428682648929801",
            type : "car",
            modelName : "BMW x",
            registrationYear : "2019",
            colour : "black",
            numberOfDoors : "3",
            fuelType : "Diesel",
            time : "1563194792498"
        }
    },
    {
        txId : "752177fe9981203675f2b721aad14dc9ab2de662f5f93dfa9ecefb05903bf59c",
        type : "tendermint_blob",
        format : {
            sdkVersion : "3.0",
            keyPairType : "Ed25519",
            driverType : "bdbDriver",
            encodeType : "base64"
        },
        data : {
            serialNumber : "56288428682648929801",
            type : "car",
            modelName : "BMW x",
            registrationYear : "2019",
            colour : "black",
            numberOfDoors : "3",
            fuelType : "Diesel",
            time : "1563197232961"
        }
    }
];
const tmTx = [
    {
        txId : "3c8a0f00f1ad2c50c3b3979a781a52f576a4db510137242894fb0f96c905c0a3",
        txData : {
            id : "3c8a0f00f1ad2c50c3b3979a781a52f576a4db510137242894fb0f96c905c0a3",
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
                    fulfillment : "pGSAICOUBOCifUxKqLuoms1l0OPjYFsr0czztsFHPedBO24EgUCcs2PoQg51DuOSD8L-qlwVfZgl9RiseGKCEZOp8c-rACMSciCzDa-Hi4FGCmlL2VU7rwBPosfCYKd1MhTRGbQC",
                    fulfills : null,
                    owners_before : [ 
                        "3PtBLYHY9n3KEr5KeSQ5RQiQXGUkesa6Vvqvk3KTEfN3"
                    ]
                }
            ],
            metadata : {
                clientId : "test"
            },
            asset : {
                data : {
                    serialNumber : "56288428682648929801",
                    type : "car",
                    modelName : "BMW x",
                    registrationYear : "2019",
                    colour : "black",
                    numberOfDoors : "3",
                    fuelType : "Diesel",
                    time : "1563194792498"
                }
            },
            version : "2.0"
        },
        txMetadata : {
            project : {
                timestamp : 1563194792610.0,
                datetime : "2019-07-15T12:46:32Z",
                user : {
                    domainId : "d01"
                }
            }
        }
    },
    {
        txId : "752177fe9981203675f2b721aad14dc9ab2de662f5f93dfa9ecefb05903bf59c",
        txData : {
            id : "752177fe9981203675f2b721aad14dc9ab2de662f5f93dfa9ecefb05903bf59c",
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
                    fulfillment : "pGSAICOUBOCifUxKqLuoms1l0OPjYFsr0czztsFHPedBO24EgUBV-RiHPpAOazNVc1wMR7cAxN56nfVxTSHq02L0AbfKWTuzWzAKA4B-hGFDlOqAbyrFX5J_I1bAnmIHOvNKjG4P",
                    fulfills : null,
                    owners_before : [ 
                        "3PtBLYHY9n3KEr5KeSQ5RQiQXGUkesa6Vvqvk3KTEfN3"
                    ]
                }
            ],
            metadata : {
                clientId : "test",
                color : "black"
            },
            asset : {
                data : {
                    serialNumber : "56288428682648929801",
                    type : "car",
                    modelName : "BMW x",
                    registrationYear : "2019",
                    colour : "black",
                    numberOfDoors : "3",
                    fuelType : "Diesel",
                    time : "1563197232961"
                }
            },
            version : "2.0"
        },
        txMetadata : {
            project : {
                timestamp : 1563197233127.0,
                datetime : "2019-07-15T13:27:13Z",
                user : {
                    domainId : "d01"
                }
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
                find: filter => {
                  if (filter) {
                        return tmTx;
                  } 
                  return tmTx;
                }
              },
          tmMetadata: {
            find: () => {
                return tmMetadata;
              }
          },
          tmAsset: {
            find: filter => {
              if (filter) {
                    return tmAsset;
              } 
              return tmAsset;
            }
          }
        }
      }
    }[name] || {};
  }
};


module.exports = {
  _services,
  transactions: tmTx,
  assets: tmAsset
};
