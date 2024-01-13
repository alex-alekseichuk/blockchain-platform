#!/usr/bin/env node
/**
 * Main CLI file to run project-tx tool.
 */
'use strict';

const app = require('./app');

const argv = require('yargs')
  .usage('Usage: $0 command [options]')

  .command(['create', '$0'], 'post CREATE tx', yargs => {
    return yargs
      .alias('c', 'create')
      .option('amount', {
        alias: 'a',
        describe: 'Amount integer value to put into tx',
        default: 1
      })
      .option('description', {
        alias: 'd',
        describe: 'Description string to put into payload'
      })
      .option('wallet', {
        alias: 'w',
        describe: 'Wallet file'
      });
  }, async argv => {(await app(argv)).postCreateTx()})

  .command('transfer', 'post TRANSFER tx', yargs => {
    return yargs
      .alias('t', 'transfer')
      .option('address', {
        alias: 'a',
        describe: 'Destination address',
        demand: true
      })
      .option('wallet', {
        alias: 'w',
        describe: 'Source wallet file',
        demand: true
      })
      .option('txId', {
        alias: 'tx',
        describe: 'Source transactionID',
        demand: true
      })
      .option('description', {
        alias: 'd',
        describe: 'Description string to put into payload'
      });
  }, async argv => {(await app(argv)).postTransferTx()})

  .command(['wallet'], 'create wallet', yargs => {
    return yargs
      .alias('w', 'wallet')
      .option('out', {
        alias: 'output',
        describe: "Output wallet file",
      });
  }, async argv => {(await app(argv)).createWallet()})

  .command(['get'], 'get tx', yargs => {
    return yargs
      .option('txId', {
        alias: 'tx',
        describe: 'ID of tx',
        demand: true
      });
  }, async argv => {(await app(argv)).getTx()})

  .command(['listen'], 'listen for tx', yargs => {
    return yargs
      .alias('l', 'listen')
      .option('query', {
        alias: 'q',
        describe: "JSON query to filter tx records",
      });
  }, async argv => {(await app(argv)).listenTx()})

  .command(['query'], 'query tx', yargs => {
    return yargs
      .alias('q', 'query')
      .option('query', {
        alias: 'q',
        describe: "JSON query to filter tx records",
      })
      // .option('out', {
      //   alias: 'output',
      //   describe: "File to save the array of loaded tx records. It's in JSON format",
      // })
      ;
  }, async argv => {(await app(argv)).queryTx()})

  .option('configFile', {
    describe: 'Path to custom config file'
  })
  .option('type', {
    alias: 't',
    describe: 'Digital Asset type'
  })
  .option('configServer', {
    describe: 'URL to config server'
  })
  .argv;
