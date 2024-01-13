/**
 * Stuff for building CLI nodejs applications/tools.
 */
'use strict';
const common = require('../../common');
const storage = require('./storage');
const websocket = require('../websocket');

const cli = {
  storage,
  createContext: () => {
    const c = common.context.create();
    c.runtime = 'nodejs';
    return c;
  },
  initApp: async argv => {
    const app = cli.createContext()
      .reg(common.logger)
      .reg(storage)
      .reg(common.clientIdUtil)
      .reg(common.http.axiosClientHttp)
      .reg(common.api.apiConfig, {bootHttpConfig:{baseURL: argv.configServer}});
    app.sessionHttp = app.clientHttp;

    try {
      app.config = await app.apiConfig.loadConfig();
    } catch (apiError) {
      app.logger.error(`Can't load config from the server`, 'common:cli/index:initApp');
      return null;
    }

    if (app.config.websocket && app.config.websocket.enabled) {
      app.reg(websocket);
      app.websocket.open();
    }

    return app;
  },
  initAppWithtLogin: async argv => {
    const app = cli.createContext()
      .reg(common.logger)
      .reg(storage)
      .reg(common.clientIdUtil)
      .reg(common.http.axios)
      .reg(common.api.apiConfig, {bootHttpConfig:{baseURL: argv.configServer}});

    try {
      app.config = await app.apiConfig.loadConfig();
    } catch (apiError) {
      app.logger.error(`Can't load config from the server`, 'common:cli/index:initAppWithtLogin');
      return null;
    }

    await app.regAsync(common.session, {onLogin: async session => {
      const result = await session.login(await require('prompts')([
        {
          type: 'text',
          name: 'username',
          message: 'What is your username?'
        },
        {
          type: 'password',
          name: 'password',
          message: 'What is your password?'
        }
      ]));
      return result;
    }});

    if (app.config.websocket && app.config.websocket.enabled) {
      app.reg(websocket);
      app.websocket.open();
    }

    return app;
  },
  waitOnPressEnter: () => {
    if (!_readline)
      _readline = require('readline').createInterface({
        input: process.stdin,
        output: process.stdout
      });
    return new Promise(resolve => _readline.question('', resolve));
  },
  exitOnPressEnter: cb => {
    cli.waitOnPressEnter().then(async () => {
      if (cb) {
        await cb();
      }
      process.exit(0);
    });
  }
};

module.exports = cli;

let _readline;
