"use strict";

const tmAsset = [
    {
        txId : "f3603126c3c0c7ecc1dd5fca8b2ed7c6e04fd65e8e7f8f305f6ae1e70cd6eb4f",
        type : "car",
        format : {
            sdkVersion : "3.0",
            keyPairType : "Ed25519",
            driverType : "bdbDriver",
            encodeType : "base64"
        },
        data : {
            serialNumber : "56288320528682648929801",
            modelName : "BMW x",
            registrationYear : "2019",
            colour : "black",
            numberOfDoors : "3",
            fueltype : "Diesel",
            time : "1560263418117"
        }
    },    
    {
        txId : "499ad5882687edbd202510bd7f51a1e3883d52b90f4afff3f1a8e8f345af2b7c",
        type : "car",
        format : {
            sdkVersion : "3.0",
            keyPairType : "Ed25519",
            driverType : "bdbDriver",
            encodeType : "base64"
        },
        data : {
            serialNumber : "897007508355702487350052",
            modelName : "Mercedes",
            registrationYear : "2018",
            colour : "white",
            numberOfDoors : "5",
            fueltype : "petrol",
            time : "1560263418117"
        }
    },    
    {
        txId : "e431f434e8ba6c086c20f7772055a9e636cef0b2f930d8a25a6184b116ca8f28",
        type : "book",
        format : {
            sdkVersion : "3.0",
            keyPairType : "Ed25519",
            driverType : "bdbDriver",
            encodeType : "base64"
        },
        data : {
            title : "the alchemist",
            author : "Mr x",
            year : "2015",
            language : "english",
            time : "1560263418117"
        }
    },
    {
        txId : "4cb3dbc63c94d49075106ab2a7f41364fcfde9a5c1bb77b833252daa56fbf72e",
        type : "book",
        format : {
            sdkVersion : "3.0",
            keyPairType : "Ed25519",
            driverType : "bdbDriver",
            encodeType : "base64"
        },
        data : {
            title : "harry potter",
            author : "Mr ABC",
            year : "2018",
            language : "english",
            time : "1560263418117"
        }
    },    
    {
        txId : "1c640610a09ce07753f2753824de597f91c9380ad23f3fa0e7f94f2e7fa7ffd6",
        type : "book",
        format : {
            sdkVersion : "3.0",
            keyPairType : "Ed25519",
            driverType : "bdbDriver",
            encodeType : "base64"
        },
        data : {
            title : "2 states",
            author : "Mr John",
            year : "2016",
            language : "german",
            time : "1560263418117"
        }
    }
];

const tmTx = [
    {
     txId: "f3603126c3c0c7ecc1dd5fca8b2ed7c6e04fd65e8e7f8f305f6ae1e70cd6eb4f",
     txData : {
        id : "f3603126c3c0c7ecc1dd5fca8b2ed7c6e04fd65e8e7f8f305f6ae1e70cd6eb4f",
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
                fulfillment : "pGSAICOUBOCifUxKqLuoms1l0OPjYFsr0czztsFHPedBO24EgUA4XqZCWBkTESURP52O7OqHXjoU8vf8iRLMqcYeYFYNHvEGQVjfNOjF0lWJ-aRl9E3CTR_fQISyEwchogG0vBUF",
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
                time : "1560263418117"
            }
        },
        version : "2.0"
    },
    txMetadata : {
        project: {
            timestamp: 1
    }
}
},
{
    txId : "499ad5882687edbd202510bd7f51a1e3883d52b90f4afff3f1a8e8f345af2b7c",
    txData : {
        id : "499ad5882687edbd202510bd7f51a1e3883d52b90f4afff3f1a8e8f345af2b7c",
        operation : "CREATE",
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
                fulfillment : "pGSAIObkBqsIPXxetjj8ng0lbDiHhvSh8mehvw2HOyOm0-RcgUDI9PmnxVMYUWdc4UtnlgVk6cFAZ3Xm5RgM_F330OpWuU9no_mcBS4cC-7NXBMCY9cJSHT2N_bMLBoS1cnycTIE",
                fulfills : null,
                owners_before : [ 
                    "GYJSQ26pB24mwafXbMLpsjgD3QLS8oaKbjmnSPbiWBWB"
                ]
            }
        ],
        metadata : {},
        asset : {
            data : {
                serialNumber : "897007508355702487350052",
                Type : "car",
                modelName : "Mercedes",
                registrationYear : "2018",
                colour : "white",
                numberOfDoors : "5",
                fueltype : "petrol",
                time : "1560263418117"
            }
        },
        version : "2.0"
    },
    txMetadata : {
        project: {
            timestamp: 2
    }
    }
},
{
    txId : "e431f434e8ba6c086c20f7772055a9e636cef0b2f930d8a25a6184b116ca8f28",
    txData : {
        id : "e431f434e8ba6c086c20f7772055a9e636cef0b2f930d8a25a6184b116ca8f28",
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
                fulfillment : "pGSAIBVe89QH_2tyVfzBcSfL9oGTFpYv1UV6w395tx2grTObgUDGfDhJGfyEnQ_01LrRO8teYE_-tKVqH3f5z2a8m7FpUfciM23TLrptgkXRgE9-isjVqHJnTbSQaJvjdpnTqeUE",
                fulfills : null,
                owners_before : [ 
                    "2SRYD7njZV28cWtN8b6hioDrftUXKemDY6v2wuoWZrAW"
                ]
            }
        ],
        metadata : {},
        asset : {
            data : {
                title : "the alchemist",
                author : "Mr x",
                year : "2015",
                language : "english",
                time : "1560263418117"
            }
        },
        version : "2.0"
    },
    txMetadata : {
        project: {
            timestamp: 3
    }
    }
},
{
    txId : "4cb3dbc63c94d49075106ab2a7f41364fcfde9a5c1bb77b833252daa56fbf72e",
    txData : {
        id : "4cb3dbc63c94d49075106ab2a7f41364fcfde9a5c1bb77b833252daa56fbf72e",
        operation : "CREATE",
        outputs : [ 
            {
                condition : {
                    details : {
                        type : "ed25519-sha-256",
                        public_key : "CWVVM53w8FqYR37odSuZGsD6b8UA24D8d6YoShzQsEnd"
                    },
                    uri : "ni:///sha-256;_FWrDSF3fshpVUKLX4iVtf5BZIdpKJf0tugoIggOStU?fpt=ed25519-sha-256&cost=131072"
                },
                amount : "1",
                public_keys : [ 
                    "CWVVM53w8FqYR37odSuZGsD6b8UA24D8d6YoShzQsEnd"
                ]
            }
        ],
        inputs : [ 
            {
                fulfillment : "pGSAIKr-nKkyh7xH5jlw71sKzdxs0jt_RdCd_5vmTGtHx2aKgUAzmR4PkhFZS3etFZpZoKyA1nTPrvZJO6ZOj-BXOU0YM57wRQyiRN5c0bxIwSi1_PpFfgTdo6rDkX0F8MuKApwP",
                fulfills : null,
                owners_before : [ 
                    "CWVVM53w8FqYR37odSuZGsD6b8UA24D8d6YoShzQsEnd"
                ]
            }
        ],
        metadata : {},
        asset : {
            data : {
                title : "harry potter",
                author : "Mr ABC",
                year : "2018",
                language : "english",
                time : "1560263418117"
            }
        },
        version : "2.0"
    },
    txMetadata : {
        project: {
            timestamp: 4
    }
    }
},
{
    txId : "1c640610a09ce07753f2753824de597f91c9380ad23f3fa0e7f94f2e7fa7ffd6",
    txData : {
        id : "1c640610a09ce07753f2753824de597f91c9380ad23f3fa0e7f94f2e7fa7ffd6",
        operation : "CREATE",
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
                fulfillment : "pGSAIObkBqsIPXxetjj8ng0lbDiHhvSh8mehvw2HOyOm0-RcgUDIUrLNP8WaZGhI46HGIfhppRozyzOUPnAalo6X1PQ0MbouSuFrPqtireh4BvDVhF4kSsooi0MjPq3EeiSih8sB",
                fulfills : null,
                owners_before : [ 
                    "GYJSQ26pB24mwafXbMLpsjgD3QLS8oaKbjmnSPbiWBWB"
                ]
            }
        ],
        metadata : {},
        asset : {
            data : {
                title : "2 states",
                author : "Mr John",
                year : "2016",
                language : "german",
                time : "1560263418117"
            }
        },
        version : "2.0"
    },
    txMetadata : {
        project: {
            timestamp: 5
    }
    }
},
{
    txId : "a8aad455d8065c5564e29922afd0a3d6778ee7ab21855e474469e0cbbe1e3b1e",
    txData : {
        id : "a8aad455d8065c5564e29922afd0a3d6778ee7ab21855e474469e0cbbe1e3b1e",
        operation : "TRANSFER",
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
                fulfillment : "pGSAICOUBOCifUxKqLuoms1l0OPjYFsr0czztsFHPedBO24EgUBe4GEjy5pLlRaQEPItJg7q8xgO-vSIVmGDD8pLaCvrdALZwmgxn0qpw2GSxsoFgLa7GjBt-RKxuXLZ6othGYIO",
                fulfills : {
                    output_index : 0,
                    transaction_id : "f3603126c3c0c7ecc1dd5fca8b2ed7c6e04fd65e8e7f8f305f6ae1e70cd6eb4f"
                },
                owners_before : [ 
                    "3PtBLYHY9n3KEr5KeSQ5RQiQXGUkesa6Vvqvk3KTEfN3"
                ]
            }
        ],
        metadata : {},
        asset : {
            id : "f3603126c3c0c7ecc1dd5fca8b2ed7c6e04fd65e8e7f8f305f6ae1e70cd6eb4f"
        },
        version : "2.0"
    },
    txMetadata : {
        project: {
            timestamp: 6
    }    }
},
{
    txId : "834a158abf801229c76c5f7632c0a34b32b143ee4307cf810e4e9fb22c82dc93",
    txData : {
        id : "834a158abf801229c76c5f7632c0a34b32b143ee4307cf810e4e9fb22c82dc93",
        operation : "TRANSFER",
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
                fulfillment : "pGSAIObkBqsIPXxetjj8ng0lbDiHhvSh8mehvw2HOyOm0-RcgUCbSq13n-8DXunBh41ITXj4FWn5L5XMRUpzsOcIq_Ii63H_YUu6PqDdnO5KguMRAdnAV_xN1hQTCFECjv0SXS8C",
                fulfills : {
                    output_index : 0,
                    transaction_id : "499ad5882687edbd202510bd7f51a1e3883d52b90f4afff3f1a8e8f345af2b7c"
                },
                owners_before : [ 
                    "GYJSQ26pB24mwafXbMLpsjgD3QLS8oaKbjmnSPbiWBWB"
                ]
            }
        ],
        metadata : {},
        asset : {
            id : "499ad5882687edbd202510bd7f51a1e3883d52b90f4afff3f1a8e8f345af2b7c"
        },
        version : "2.0"
    },
    txMetadata : {
        project: {
            timestamp: 7
    }    }
},
{
    txId : "c4a1bd8488083ba3ee9da73a8fafcf5f87e39a35e62f7ed12e9a81ca34ae4b5a",
    txData : {
        id : "c4a1bd8488083ba3ee9da73a8fafcf5f87e39a35e62f7ed12e9a81ca34ae4b5a",
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
                fulfillment : "pGSAIBVe89QH_2tyVfzBcSfL9oGTFpYv1UV6w395tx2grTObgUAsB7csOJOahSln3na7kaXxZ15-P_KRWm_uMbbdH7XuuxW1PRAUu4lkboRnql5mrqQVJP3tUOjY-Y7-QHBHS2UO",
                fulfills : {
                    output_index : 0,
                    transaction_id : "e431f434e8ba6c086c20f7772055a9e636cef0b2f930d8a25a6184b116ca8f28"
                },
                owners_before : [ 
                    "2SRYD7njZV28cWtN8b6hioDrftUXKemDY6v2wuoWZrAW"
                ]
            }
        ],
        metadata : {},
        asset : {
            id : "e431f434e8ba6c086c20f7772055a9e636cef0b2f930d8a25a6184b116ca8f28"
        },
        version : "2.0"
    },
    txMetadata : {
        project: {
            timestamp: 8
    }    }
},
{
    txId : "a0d963c51e3b859fdd767d6227f037b0212a351c2f609496069e47fdbb62df0a",
    txData : {
        id : "a0d963c51e3b859fdd767d6227f037b0212a351c2f609496069e47fdbb62df0a",
        operation : "TRANSFER",
        outputs : [ 
            {
                condition : {
                    details : {
                        type : "ed25519-sha-256",
                        public_key : "CWVVM53w8FqYR37odSuZGsD6b8UA24D8d6YoShzQsEnd"
                    },
                    uri : "ni:///sha-256;_FWrDSF3fshpVUKLX4iVtf5BZIdpKJf0tugoIggOStU?fpt=ed25519-sha-256&cost=131072"
                },
                amount : "1",
                public_keys : [ 
                    "CWVVM53w8FqYR37odSuZGsD6b8UA24D8d6YoShzQsEnd"
                ]
            }
        ],
        inputs : [ 
            {
                fulfillment : "pGSAIObkBqsIPXxetjj8ng0lbDiHhvSh8mehvw2HOyOm0-RcgUAX9SvOvgiZwNVKvbcBHkSsxczyMcS7x0t4kuLJhWaGgyXn2OGKqNlCWhVmCTeObzjxxoeaAkVOSXvDuAarudYP",
                fulfills : {
                    output_index : 0,
                    transaction_id : "1c640610a09ce07753f2753824de597f91c9380ad23f3fa0e7f94f2e7fa7ffd6"
                },
                owners_before : [ 
                    "GYJSQ26pB24mwafXbMLpsjgD3QLS8oaKbjmnSPbiWBWB"
                ]
            }
        ],
        metadata : {},
        asset : {
            id : "1c640610a09ce07753f2753824de597f91c9380ad23f3fa0e7f94f2e7fa7ffd6"
        },
        version : "2.0"
    },
    txMetadata : {
        "timestamp" : 9
    }
},
{
    txId : "6ca07b9f18b0d76c4ead3a75b812d79d48660280380280303ad2fb2eed0a19d1",
    txData : {
        id : "6ca07b9f18b0d76c4ead3a75b812d79d48660280380280303ad2fb2eed0a19d1",
        operation : "TRANSFER",
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
                fulfillment : "pGSAIKr-nKkyh7xH5jlw71sKzdxs0jt_RdCd_5vmTGtHx2aKgUCQNYaJiO-kF9yKe28NnN2jHVOFy3ePw9dyJrs9E94apGA2KG2dBuYbyMmZKe_WqvaaFO0RvLZuh9sc0llquUoK",
                fulfills : {
                    output_index : 0,
                    transaction_id : "4cb3dbc63c94d49075106ab2a7f41364fcfde9a5c1bb77b833252daa56fbf72e"
                },
                owners_before : [ 
                    "CWVVM53w8FqYR37odSuZGsD6b8UA24D8d6YoShzQsEnd"
                ]
            }
        ],
        metadata : {},
        asset : {
            id : "4cb3dbc63c94d49075106ab2a7f41364fcfde9a5c1bb77b833252daa56fbf72e"
        },
        version : "2.0"
    },
    txMetadata : {
        project: {
            timestamp: 10
    }
    }
}
];

const users = {
    alice: {
        privateKey: 'Db1mbaoCxmcqvkRCL3aDHmR18UDx3rViDecNMzmRAD77',
        publicKey: '3PtBLYHY9n3KEr5KeSQ5RQiQXGUkesa6Vvqvk3KTEfN3'
      },
    bob: {
      privateKey: "149u6rWYs7JgRbQZUuLigbjisf1yx5UkvKk3toutpTqf",
      publicKey: "GYJSQ26pB24mwafXbMLpsjgD3QLS8oaKbjmnSPbiWBWB"
    },
    charlie: {
        privateKey: '62xEiowgZDA9uXURt1RkLYZ35GPu95jCwBkv81ZCdhgo',
        publicKey: '2SRYD7njZV28cWtN8b6hioDrftUXKemDY6v2wuoWZrAW'
      },
    dora: {
        privateKey: 'GdCYy84QEwVe5f6rG33pW64uY6TNAqDjANzYScBoKzVg',
        publicKey: 'CWVVM53w8FqYR37odSuZGsD6b8UA24D8d6YoShzQsEnd'
    }
};

const _services = {
  get: name => {
    return {
      i18n: {
        __: () => ''
      },
      'abci-client': {
        getTxById: assetId => {
          return tmTx.find(tx => tx.txId === assetId);
        }
      },
      'metricsClient': {
        increment: () => {
        }
      },
      loopbackApp: {
        models: {
          tmTx: {
            find: filter => {
              if (filter) {
                if (filter.where.hasOwnProperty('txData.asset.id')) {
                    return tmTx.filter(tx => tx.txData.asset.id === filter.where['txData.asset.id']);
                }  
              } 
              return tmTx;
            }
          },
          tmAsset: {
            findOne: filter => { 
                return tmAsset.find(asset => asset.txId === filter.where.txId);
            }
          }
        }
      }
    }[name] || {};
  }
};

module.exports = {
  _services,
  assets: tmAsset,
  transactions: tmTx,
  users
};
