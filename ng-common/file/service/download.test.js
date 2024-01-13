'use strict';
const sinonChai = require("sinon-chai");
const chai = require('chai');
chai.should();
const chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised);
chai.use(sinonChai);

const loggerMock = {
  debug: () => {
  },
  error: () => {
  },
  info: () => {
  }
};

const answers = {
  meta: {
    txPayload: {
      inputs: [
        {
          owners_before: ["8CYQ4yrHXeBF94U8ZdPWhdQkuPjVXJnPpBya5dKjcgLS"],
          fulfills: null,
          fulfillment: "pGSAIGr2suwt79E9jYyJXv2_T9n51SnzHLxp9ssGsYI3mF47gUAZrYSPEvKAu8hinxqKO8bykxJHDySO3ajHm9EZ9jAwgVQlv_w46R0Fu81idDkqLmeGrpcpkVydVX7ICJdrYrIK"
        }
      ],
      outputs: [
        {
          public_keys: [
            "8CYQ4yrHXeBF94U8ZdPWhdQkuPjVXJnPpBya5dKjcgLS"
          ],
          condition: {
            details: {
              type: "ed25519-sha-256",
              public_key: "8CYQ4yrHXeBF94U8ZdPWhdQkuPjVXJnPpBya5dKjcgLS"
            },
            uri: "ni:///sha-256;QAtSt2ybqavJeOdS31mEZcqCt_fcvqM4AOSYRotoyeU?fpt=ed25519-sha-256&cost=131072"
          },
          amount: "1"
        }
      ],
      operation: "CREATE",
      metadata: {user: {domainId: "D01"}},
      asset: {
        data: {
          type: "document_sharing",
          provider: "mongodb",
          fileId: "72878a40-1df1-11e9-a9df-37ae3410a432",
          filename: "config.toml",
          enableEncrypt: true,
          fileHash: "kTCRLBL8ABAm3eoUoWEhn8GJki6TEhk1hQQomoYmxs4m9zAdCjrQK3Vw7iVmrygP8vcpTrSyPLWxJm3yPj7iakb",
          fileSize: 6177,
          blockSize: 4194304,
          blocksCount: 1,
          username: "user1",
          project_id: "",
          additionalMsg: "",
          timeout: 3214080000,
          keys: [
            {
              email: "vetalitty@gmail.com",
              pubkey: "BQMFzYv5yyMRkpRpQaWXcoyHm5tHrB8XLUkzNLfW6bqK"
            }
          ],
          contractId: "d6145732c60518a666a13ab6ec1e318ebf7ed87d817a90f9d6d2848a71f65280",
          timestamp: 1548125853460
        }
      },
      version: "2.0",
      id: "dffad891e41b090f0d230cd09f6fb40a86f3bf09a5245b89b4a7ed72c0f1b63d"
    },
    maxBlobDownload: 41943040
  },
  filePart: '1part',
  secretSecret: {
    keyPart: "aBlV8bENK3MTtbQtElt3uzVF0FX3vPUAseRxWc2c%2BRvf5cIwzOP7o5ix3AHieF2tL8%2FHdvTAwhS04kJDQSZhU87GkE7w6RuBJ78paDPQO0M%3D"
  },
  federationNodes: {
    federationNodes: [
      "127.0.0.1:8443"
    ]
  },
  contractId: 'd6145732c60518a666a13ab6ec1e318ebf7ed87d817a90f9d6d2848a71f65280'
};

const httpMock = {
  post: uri => {
    switch (uri) {
      case '/ng-rt-file-service-backend/actions/document/meta':
        return answers.meta;
      case '/ng-rt-file-service-backend/actions/block/download':
        return answers.filePart;
      case '/ng-rt-file-service-backend/actions/get-secret-part':
        return answers.secretSecret;
      case '/ng-rt-file-service-backend/actions/get-federation-nodes':
        return answers.federationNodes;
      default:
        return;
    }
  }
};

const keysServiceMock = {
  getDefault: () => ({pubkey: 'BQMFzYv5yyMRkpRpQaWXcoyHm5tHrB8XLUkzNLfW6bqK'})
};

describe('Download test', () => {
  const DownloadService = require('./download');
  const downloadService = new DownloadService(httpMock, keysServiceMock, {}, false);

  describe('getMeta', () => {
    it('should return meta', async() => {
      const meta = await downloadService.getMeta('dffad891e41b090f0d230cd09f6fb40a86f3bf09a5245b89b4a7ed72c0f1b63d');
      meta.should.be.deep.equal(answers.meta);
    });
  });

  describe('download', () => {
    it('route should don\'t throw', async() => {
      const _this = {...downloadService};
      _this.blobDownloading = () => true;
      const download = await downloadService.download.call(_this);
      download.should.be.equal(true);
    });
  });

  describe('blob downloading', () => {
    it('should return content and meta', async() => {
      const _this = {...downloadService};
      _this.requestChunk = () => {
        _this.fileRawBlob += 1;
        _this.fileMeta = answers.meta;
      };
      const download = await downloadService.blobDownloading.call(_this);
      download.should.be.deep.equal({content: '1', meta: answers.meta});
    });
  });

  describe('requestChunk', () => {
    it('should put into fileRawBlob file', async() => {
      const _this = {...downloadService};
      _this.logger = loggerMock;
      await downloadService.requestChunk.call(_this);
      downloadService.fileRawBlob[0].should.be.equal(answers.filePart);
    });
  });

  describe('secretSecret', () => {
    it('should return secretSecret key and contractId', async() => {
      const _this = {...downloadService};
      _this.logger = loggerMock;
      _this.fileMeta = answers.meta;
      _this.utils = {
        nonce: () => new Uint8Array([1, 2, 3, 4, 5, 6, 7, 8, 9, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 0, 1, 2, 3, 4]),
        _base64ToArrayBuffer: base64 => {
          const binaryString = base64;
          let bytes = new Uint8Array(binaryString.length);

          bytes.forEach((el, i) => {
            bytes[i] = binaryString.charCodeAt(i);
          });

          return bytes.buffer;
        }
      };
      const secretSecret = await downloadService.getSecretSecret.call(_this);
      secretSecret.should.have.property('contractId');
      secretSecret.should.have.property('secretsecret');
      secretSecret.contractId.should.be.equal(answers.contractId);
    });
  });
});
