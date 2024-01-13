'use strict';
import "core-js/stable";
import "regenerator-runtime/runtime";

const appFactory = require('./app');
let app;

const ui = {
  appendTx: listTx => {
    for (const tx of listTx)
      appendSingleTx(tx);
  },
  apply: (state, payload) => {
    if (payload && payload.toast) {
      alert(payload.toast);
    }
    switch (state) {
      case 'init':
        updateWallets(payload.wallets);

        document.getElementById('btnCreateWallet').addEventListener('click', event => {
          event.preventDefault();
          app.sm.action('createWallet');
        });

        document.getElementById('btnPostCreateTx').addEventListener('click', event => {
          event.preventDefault();

          const amount = parseInt(document.getElementById('txtAmount').value, 10);
          if (isNaN(amount))
            return;

          let walletId =  document.getElementById('selWallet').value;
          if (!walletId)
            return;
          walletId = +walletId;

          app.sm.action('postCreateTx', {
            walletId,
            amount,
            description: document.getElementById('txtCreateDescription').value
          });
        });

        document.getElementById('btnPostTransferTx').addEventListener('click', event => {
          event.preventDefault();

          let inWalletId =  document.getElementById('selInWallet').value;
          if (!inWalletId)
            return;
          inWalletId = +inWalletId;

          const srcTxId = document.getElementById('txtSrcTxId').value;
          if (!srcTxId)
            return;

          let outAddress =  document.getElementById('txtOutAddress').value;
          if (!outAddress)
            return;

          app.sm.action('postTransferTx', {
            inWalletId,
            srcTxId,
            outAddress,
            description: document.getElementById('txtTransferDescription').value
          });
        });

        app.sm.action('loadTx');

        break;
      case 'ready':
        if (payload && payload.wallets)
          updateWallets(payload.wallets);
        // if (payload && payload.tx)
        //   appendSingleTx(payload.tx);
        if (payload && payload.txList)
          appendTx(payload.txList);
        break;
    }
  }
};

document.addEventListener("DOMContentLoaded", async function() {
  app = await appFactory(ui);
});

function updateWallets(wallets) {
  const liItems = wallets.reduce((s, item) => s += `<li>${item.address}</li>`, '');
  const options = wallets.reduce((s, item) => s += `<option value="${item.id}">${item.address}</option>`, '');
  document.getElementById('lstWallets').innerHTML = liItems;
  document.getElementById('selWallet').innerHTML = options;
  document.getElementById('selInWallet').innerHTML = options;
}

function appendSingleTx(tx) {
  const tr = document.createElement("tr");
  const row = `<tr>
  <td>${tx.id}</td>
  <td>${tx.timestamp}</td>
  <td>${tx.status}</td>
  <td>${tx.inputs ? tx.inputs[0].txId : 'CREATE TX'}</td>
  <td>${tx.outputs[0].address}</td>
  <td>${tx.amount}</td>
  <td>${tx.description}</td>
</tr>`;
  tr.innerHTML = row;
  const tblTx = document.getElementById('tblTx');
  const tbody = tblTx.querySelector('tbody');
  tbody.appendChild(tr);
}
