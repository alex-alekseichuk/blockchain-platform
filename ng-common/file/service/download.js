'use strict';
const {decrypt} = require('../cryptor');
const utils = require('../utils');

/**
 * @param {*} http service for send requests POST, GET and etc
 * @param {*} keysService service for keys
 * @param {*} loggerService logging service
 * @param {*} cryptor cryptor
 */
function DownloadService(http, keysService, loggerService, cryptor) {
  this.routes = {
    meta: '/ng-rt-file-service-backend/actions/document/meta',
    download: '/ng-rt-file-service-backend/actions/block/download',
    secretSecret: '/ng-rt-file-service-backend/actions/get-secret-part',
    federationNodes: '/ng-rt-file-service-backend/actions/get-federation-nodes'
  };

  this.keys = keysService;
  this.logger = loggerService;
  this.fileMeta = null;
  this.index = 0;
  this.fileRawBlob = [];
  this.http = http;
  this.cryptor = cryptor;
  this.utils = utils;
  this.hash = null;
}

DownloadService.prototype.getMeta = async function(token) {
  if (!token) {
    throw Error('Missing token');
  }
  const defKey = this.keys.getDefault();

  if (!defKey) {
    throw Error('default key not found');
  }

  const data = await this.http.post(this.routes.meta, {
    id: token,
    pubKey: defKey.pubkey
  });
  if (data.variant === "ERROR") {
    throw new Error(data.result);
  } else {
    this.fileMeta = data;
    return data;
  }
};

DownloadService.prototype.download = function() {
  if (this.fileMeta.maxBlobDownload && this.fileMeta.maxBlobDownload > this.fileMeta.txPayload.asset.data.fileSize) {
    return this.blobDownloading();
  }
  throw new Error('property maxBlobDownload is not set');
};

DownloadService.prototype.blobDownloading = async function() {
  for (this.index; this.index < this.fileMeta.txPayload.asset.data.blocksCount; this.index++) {
    await this.requestChunk();
  }
  return {content: this.fileRawBlob, meta: this.fileMeta, hash: this.hash};
};

DownloadService.prototype.requestChunk = async function() {
  this.logger.debug('Try to request chunk fileId: ' + this.fileMeta.txPayload.asset.data.fileId + ', index: ' + this.index);
  this.logger.debug("download route:", this.routes.download);

  let data;
  try {
    data = await this.http.post(this.routes.download, {
      fileId: this.fileMeta.txPayload.asset.data.fileId,
      index: this.index
    }, {
      responseType: 'arraybuffer'
    });
  } catch (e) {
    if (data && data.result) {
      throw (data.result);
    }
    throw (e);
  }

  if (this.cryptor && this.fileMeta.txPayload.asset.data.enableEncrypt) {
    const {decryptedKey} = this.cryptor;
    const {decryptedFile, hash} = await decrypt(data, decryptedKey);
    this.fileRawBlob.push(decryptedFile);
    this.hash = hash;
  } else {
    this.fileRawBlob.push(data);
    this.hash = await utils.calcHash(data);
  }
};

DownloadService.prototype.getSecretSecret = async function() {
  const {contractId} = this.fileMeta.txPayload.asset.data;
  const {federationNodes} = await this.http.post(this.routes.federationNodes, {contractId});
  let keyParts = await Promise.all(federationNodes.map(federationNodeAddress => {
    return this.http.post(this.routes.secretSecret, {
      pubKey: this.keys.getDefault().pubkey,
      contractId,
      federationNodeAddress
    });
  }));
  keyParts = keyParts.map(elem => elem.keyPart);
  this.logger.debug('keyParts' + keyParts);

  for (let i = 0; i < keyParts.length; i++) {
    const elem = keyParts[i];
    if (elem === "revoked")
      throw Error('revoked');
    if (elem === "accessDenied")
      throw Error('accessDenied');
    if (elem === "Download time expired")
      throw Error('Download time expired');
  }

  let secretsecret = keyParts.join('');
  secretsecret = secretsecret ? new Uint8Array(this.utils._base64ToArrayBuffer(decodeURIComponent(secretsecret))).slice(0, 80) : null;

  const keyId = this.keys.getDefault().id;
  const decryptedKey = this.keys.decrypt(keyId, secretsecret);
  if (this.cryptor) {
    this.cryptor = {
      decryptedKey
    };
  }

  return {decryptedKey, secretsecret, contractId};
};

module.exports = DownloadService;
