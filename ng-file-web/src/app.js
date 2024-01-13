/**
 * File upload/download web application.
 * Business logic.
 * TODO: catch/throw errors
 */
'use strict';

const {common, browser} = require('ng-common');
window.common = common;

let app;
let logger;

const appFactory = async () => {
  // TODO: better approach w/o this hardcode
  // const baseURL = 'http://192.168.3.107:3000/';
  // const baseURL = 'http://localhost:8443/';
  const baseURL = 'http://localhost:3000/';

  app = await browser.initApp(baseURL);
  if (!app) {
    return null;
  }

  logger = app.logger.get('ng-file-web:src/app');
  app.reg(common.api.apiFiles);
  app.reg(browser.file);

  const fileInfo = window.localStorage.getItem('fileInfo');
  if (fileInfo) {
    app.fileInfo = JSON.parse(fileInfo);
  }
  const encrypt = window.localStorage.getItem('encrypt');
  app.encrypt = encrypt ? JSON.parse(encrypt) : {};

  app.uploadFile = async (file) => {
    try {
      app.fileInfo = await app.file.uploadFile(file, app.encrypt.enabled ? app.encrypt.hexKey : null);
    } catch (err) {

    }

    window.localStorage.setItem('fileInfo', JSON.stringify(app.fileInfo));
    return app.fileInfo;
  };

  app.downloadFile = async (fileId) => {
    await app.file.downloadFile(fileId, app.encrypt.enabled ? app.encrypt.hexKey : null);
  };

  // TODO: uploading as a stream from browser
  app.uploadStream = async (file) => {
    const stream = new ReadableStream({
      start(controller) {
        controller.enqueue("test");
      },
      pull(controller) {
      },
    });
    const fileInfo = await app.apiFiles.uploadStream(stream, {filename: file.name});
    console.log(JSON.stringify(fileInfo, null, 2));
    return fileInfo;
  };

  app.setEncrypt = (enabled, hexKey) => {
    if (enabled && !hexKey) {
      hexKey = app.crypto.bytesToHex(app.crypto.symKey());
    }
    app.encrypt = {enabled, hexKey};
    window.localStorage.setItem('encrypt', JSON.stringify(app.encrypt));
  };

  return app;
};

module.exports = appFactory;

