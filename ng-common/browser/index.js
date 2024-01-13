'use strict';
const common = require('../common');
const browser = {
  storage: require('./storage'),
  fs: require('./fs'),
  file: require('./file'),
  uiLock: require('./uiLock'),
  websocket: require('./websocket'),
  createContext: () => {
    const c = common.context.create();
    c.runtime = 'browser';
    return c;
  },
  initApp: async (configBaseURL) => {
    const app = browser.createContext()
      .reg(common.logger)
      .reg(browser.storage)
      .reg(common.clientIdUtil)
      .reg(common.http.axiosClientHttp)
      // TODO: bootstrap configApi url in app.init() instead of hard code here
      .reg(common.api.apiConfig, {bootHttpConfig: {baseURL: configBaseURL}});
    window.app = app;
    app.sessionHttp = app.clientHttp;

    await app.regAsync(common.crypto);

    try {
      app.config = await app.apiConfig.loadConfig();
    } catch (apiError) {
      app.logger.error(`Can't load config from the server`, 'common:browser/index:initApp');
      return null;
    }

    app.reg(browser.uiLock);
    if (app.config.websocket && app.config.websocket.enabled) {
      app.reg(browser.websocket);
      app.websocket.open();
    }

    return app;
  },
  initAppWithtLogin: async (configBaseURL) => {
    const app = browser.createContext()
      .reg(common.logger)
      .reg(browser.storage)
      .reg(common.clientIdUtil)
      .reg(common.http.axiosClientHttp)
      // TODO: bootstrap configApi url in app.init() instead of hard code here
      .reg(common.api.apiConfig, {bootHttpConfig: {configBaseURL}});
    window.app = app;

    await app.regAsync(common.crypto);

    try {
      app.config = await app.apiConfig.loadConfig();
    } catch (apiError) {
      app.logger.error(`Can't load config from the server`, 'common:browser/index:initApp');
      return null;
    }

    app.reg(browser.uiLock);
    if (app.config.websocket && app.config.websocket.enabled) {
      app.reg(browser.websocket);
      app.websocket.open();
    }

    await app.regAsync(common.session, {onLogin});

    if (!app.session.isLoggedIn())
      return onLogin();

    return app;
  }
};

module.exports = browser;

function onLogin() {
  location = '/';
}
