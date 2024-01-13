#!/usr/bin/env node
/**
 * CLI tool to download the file
 * TODO: add support to save to stdout
 */
'use sctrict';
const fs = require('fs-extra');
const yargs = require('yargs');
const {common, nodejs} = require('ng-common');

(async function main() {
  const argv = yargs
    .usage('$0 [options]')
    .option('fileId', {
      alias: 'f',
      type: 'string',
      demand: true,
      describe: 'File ID to download'
    })
    .option('output', {
      alias: 'o',
      type: 'string',
      describe: 'Output file'
    })
    .option('key', {
      alias: 'k',
      type: 'string',
      default: '',
      describe: 'Secret key'
    })
    .argv;

  const app = await nodejs.cli.initApp(argv);
  if (!app)
    process.exit(1);

  app.reg(common.api.apiFiles);
  await app.regAsync(common.crypto);
  app.reg(nodejs.file);

  app.downloadFile = async function(fileId, filePath, hexKey) {
    try {
      await app.file.downloadFile(fileId, hexKey, filePath);
    } catch (err) {
      logger.error(err);
    }
  };
  
  app.downloadStream = async function(fileId, filePath, key) {
    try {
      const file = await this.apiFiles.downloadStream(fileId);
      filePath = filePath || file.filename || 'download';
      // TODO: modify filePath if such file already exists
      const stream = fs.createWriteStream(filePath, file.stream);
      if (!stream || !file.stream) {
        return;
      }
      file.stream.pipe(stream);
    } catch (err) {
      logger.error(err);
    }
  };

  await app.downloadFile(argv.fileId, argv.output, argv.key);
  // await app.downloadStream(argv.fileId, argv.output, argv.key);
})();
