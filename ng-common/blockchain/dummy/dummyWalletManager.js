/**
 * Dummy implementation of Wallet Manager service.
 * It doesn't save wallets persistently.
 */
'use strict';

function walletManager(blockchain) {
  const wallets = [];

  const service = {
    getWallets: async () => wallets,
    getWallet: async walletId => wallets.find(wallet => wallet.id === walletId),
    createWallet: async () => {
      const wallet = await blockchain.createWallet();
      wallet.id = wallets.length;
      wallets.push(wallet);
      return wallet;
    }
  };
  return service;
}

module.exports = walletManager;
