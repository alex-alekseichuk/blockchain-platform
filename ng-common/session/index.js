/**
 * Session Service/Model
 *
 * @param {object} config client config interface
 * @param {object} storage optional storage interface for the session web or node one.
 * @param {object} clientHttp optional http interface. pure axios implementation is use by default.
 * @param {function} onLogin - handler of onLogin event when user needs to provide login/password credentials
 * @return {object} Session interface and sessionHttp interface in .http property
 */
'use strict';

let data;
let _storage;

const sessionHttp = require('./sessionHttp');

module.exports = async function session(config, storage, clientHttp, onLogin) {
  const authApi = require('../api/apiAuth')(config, clientHttp);
  _storage = storage;

  if (_storage) {
    data = {
      session_token: await _storage.get('session_token'),
      pre_session_token: await _storage.get('pre_session_token')
    };
  } else {
    data = {};
  }

  const session = {
    login: async data => {
      try {
        const result = await authApi.login(data);
        await save({session_token: result.token});
      } catch (err) {
        return false;
      }
      return true;
    },
    logout: async () => {
      data = {};
      if (_storage) {
        await _storage.remove(['session_token', 'pre_session_token']);
      }
    },
    getToken: () => {
      return data.session_token;
    },
    isLoggedIn: () => {
      return Boolean(data.session_token);
    },
    loadAccessToken: async () => await authApi.getAccessToken(data.session_token),
    save
  };
  session.http = sessionHttp(session, onLogin, clientHttp);
  session.__components = {session, sessionHttp: session.http};
  return session;
};

/**
 * Save new session into storage.
 * @param {Object} newSessionData - key-value
 */
async function save(newSessionData) {
  data = Object.assign({}, data, newSessionData);
  if (_storage)
    await _storage.save(data);
}

module.exports.txContextHttp = require('./txContextHttp');
