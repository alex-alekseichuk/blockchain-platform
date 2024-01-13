/**
 * Dummy auth. service.
 * It knows about single user record.
 * It's for dev/test only.
 */
'use strict';
module.exports = function authService() {
  return {
    sessionTime: 12 * 60 * 60, // 12 hours in seconds
    authenticate: async authCtx => {
      if (authCtx.login === 'login' && authCtx.password === 'password')
        return {userId: 1, domain: 'demo'};
      else
        return null;
    }
  };
};
