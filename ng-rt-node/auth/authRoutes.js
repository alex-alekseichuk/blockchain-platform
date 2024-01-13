/**
 * Auth. HTTP API handlers.
 * Login users.
 */
'use strict';

let config;

module.exports = function authRoutes(config, httpServer, authService) {
  httpServer.post(`/login-cookies`, async (req, res, next) => {
    const authContext = getAuthContext(req);
    if (!authContext) {
      res.status(401).end();
      return;
    }

    const userContext = await authService.authenticate(authContext);
    if (!userContext) {
      res.status(401).end();
      return;
    }

    addSessionCookie(res, userContext);
    next();
  });

  httpServer.post(`/login-jwt`, async (req, res, next) => {
    const authContext = getAuthContext(req);
    if (!authContext) {
      res.status(401).end();
      return;
    }

    const userContext = await authService.authenticate(authContext);
    if (!userContext) {
      res.status(401).end();
      return;
    }

    res.json(userContext);
    next();
  });

  function getAuthContext(req) {
    // TODO: get real ones from req
    return {
      login: 'login',
      password: 'password'
    }
  }

  function addSessionCookie(res, userContext) {
    const expireInSeconds = authService.sessionTime;
    const d = new Date();
    d.setTime(d.getTime() + (expireInSeconds * 1000));
    res.cookie('context', JSON.stringify(userContext), {maxAge: (expireInSeconds * 1000), expires: d.toGMTString(),
      httpOnly: true, secure: !!config.http.secure});
  }
};
