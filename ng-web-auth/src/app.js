const common = require('ng-common');
const browser = require('ng-common-browser');
const app = common.context.create()
  .reg(browser.storage)
  .reg(common.util.clientIdUtil)
  .reg(common.util.clientHttp)
  // TODO: bootstrap configApi url instead of hard code here
  .reg(common.api.apiConfig, {bootHttpConfig:{baseURL: 'http://192.168.3.107:8443/'}});

const states = {
  init: {
    actions: {
      start: () => app.session.isLoggedIn() ? goHome() : 'loginForm'
    }
  },
  loginForm: {
    actions: {
      login: (data) => {
        app.session.login(data)
          .then(reply => app.sm.action('loginSuccess', reply))
          .catch(err => app.sm.action('loginFailed', {err}));
        return 'loginProcess';
      }
    }
  },
  loginProcess: {
    actions: {
      loginFailed: ({err}) => {return {state: 'loginForm', payload: {message: 'Incorrect login.'}};},
      loginSuccess: reply => {app.session.save({session_token: reply.token}); return goHome();}
    }
  },
  home: {
    actions:{
      logout: () => {
        app.session.logout();
        return 'loginForm';
      }
    }
  }
};

function goHome() {
  if (location.pathname !== '/admin')
    location = '/admin';
}

app.init = async delegate => {
    await app.regAsync(app.apiConfig.loadConfig);
    await app.regAsync(common.session);

    app.sm = common.sm.init({delegate, states}, 'init');
    app.sm.action('start');
};

module.exports = app;
