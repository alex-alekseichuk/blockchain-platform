/**
 * Config HTTP API handlers
 * It's for loading config from server for the client.
 * TODO: refactor: avoid getting `req.get('host')` to compose base url
 */
'use strict';

let _config;

module.exports = function configRoutes(config, httpServer) {
  httpServer.get(`/api-config`, (req, res, next) => {
    const url = `${config.http.secure ? 'https' : 'http'}://${config.http.address}:${config.http.port}`;
    const websocketUrl = `${config.http.secure ? 'wss' : 'ws'}://${config.http.address}:${config.http.port}/`;

    if (!_config) {
      _config = {
        websocket: {
          enabled: config.http.websocket && !!config.http.websocket.enabled,
          url: websocketUrl
        },
        appTx: {
          daType: 'demo'
        },
        api: {
          files: {baseURL: `${url}/`},
          blockchain: {baseURL: `${url}/`},
          dummy: {baseURL: `${url}/`}
          // auth: {baseURL: `${url}/`},
          // keys: {baseURL: `${url}/`},
          // menu: {baseURL: `${url}/`},
          // demoTx: {baseURL: `${url}/`},
          // digitalAsset: {baseURL: `${url}/ng-rt-digitalAsset/`, headers: {
          //     Cookie:
          //       'nginxauthjwt=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJsb2dpbiI6ImFkbWluIiwiZXhwIjoxNTc0NzY0NzQ2LCJpYXQiOjE1NzQ3NjI5NDZ9.FOis8LXeS9xjxb67-_G_QDGz7l40mNiX2LGX6HIelQw; Max-Age=108000; Path=/; Expires=Wed, 27 Nov 2019 16:09:06 GMT'
          //   }}
        }
      };
    }

    res.json(_config);
    next();
  });
};
