/**
 * File upload/download web application.
 * Pure JS UI layer of app.
 */
'use strict';

// for correct webpack-babel processing
import "core-js/stable";
import "regenerator-runtime/runtime";

const appFactory = require('./app');

(async function() {
  const app = await appFactory();
  if (!app) {
    console.log("Can't init application.");
    alert("Sorry, the application initialisation is failed. See details in the log.");
    return;
  }

  document.getElementById('lblBlockSize').innerHTML = app.apiFiles.blockSize;
  if (app.fileInfo && app.fileInfo.id) {
    document.getElementById('txtFileId').value = app.fileInfo.id;
  }
  if (app.encrypt) {
    document.getElementById('chkEncrypt').checked = app.encrypt.enabled;
    if (app.encrypt.hexKey)
      document.getElementById('txtKey').value = app.encrypt.hexKey;
  }
  document.getElementById('fileUpload').addEventListener('change', async event => {
    const file = event.target.files[0];
    if (file) {
      // const fileInfo = await app.uploadStream(file);
      const fileInfo = await app.uploadFile(file);
      document.getElementById('txtFileId').value = fileInfo.id;
    }
  });
  document.getElementById('btnDownload').addEventListener('click', async event => {
    event.preventDefault();
    const fileId = document.getElementById('txtFileId').value;
    if (fileId) {
      await app.downloadFile(fileId);
    }
  });
  document.getElementById('chkEncrypt').addEventListener('change', async event => {
    app.setEncrypt(document.getElementById('chkEncrypt').checked,
      document.getElementById('txtKey').value);
    document.getElementById('txtKey').value = app.encrypt.hexKey;
  });
})();
