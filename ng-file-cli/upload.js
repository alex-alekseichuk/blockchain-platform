#!/usr/bin/env node
/**
 * CLI tool to upload the file
 * TODO: add ability to load file from stdin
 */
'use sctrict';
const path = require('path');
const fs = require('fs-extra');
const yargs = require('yargs');
const {common, nodejs} = require('ng-common');

(async function main() {
  const argv = yargs
    .usage('$0 [options]')
    .option('input', {
      alias: 'i',
      type: 'string',
      demand: true,
      describe: 'Input file'
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

  const logger = app.logger.get('ng-file-cli:upload');

  app.reg(common.api.apiFiles);
  await app.regAsync(common.crypto);
  app.reg(nodejs.file);

  app.uploadFile = async function(filePath, hexKey) {
    try {
      const fileInfo = await app.file.uploadFile(filePath, hexKey);
      console.log(JSON.stringify(fileInfo, null, 2));
    } catch (err) {
      logger.error(err);
    }
  };
  
  app.uploadStream = async function(filePath, encrypt) {
    try {
      const stats = fs.statSync(filePath);
      const stream = fs.createReadStream(filePath);
      if (!stream) {
        return;
      }
      const fileInfo = await this.apiFiles.uploadStream(stream, {
        filename: path.basename(filePath),
        size: stats.size
      });
      console.log(JSON.stringify(fileInfo, null, 2));
    } catch (err) {
      logger.error(err);
    }
  };

  await app.uploadFile(argv.input, argv.key);
  // await app.uploadStream(argv.input, argv.key);
})();
