/**
 * Simple web app to get login/password from user,
 * then check it against LDAP,
 * then generate JWT token and place it into Cookie
 * Parameters may be customized by env. vars:
 * TITLE, LDAP_URL, BIND_CN, BIND_PASSWD, BASE_DN, GROUP_CN, EXPIRE, JWT_SECRET, COOKIE_NAME
 */
'use strict';
const express = require('express');
const ldap = require('ldapjs');
const jwt = require('jsonwebtoken');
const md5 = require('md5');

const app = express();

var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.set('view engine', 'pug');
app.set('views', './views');

app.use('/auth-proxy-login', express.static('public'));

const renderForm = (res, params) => {
  res.render('index', {
    ...params,
    title: process.env['TITLE'] || 'Project Playground Login'
  });
};

app.get('/auth-proxy-login', (req, res) => {
  renderForm(res);
});
app.post('/auth-proxy-login', (req, res) => {
  const login = req.body.login;
  const password = req.body.password;

  const client = ldap.createClient({
   // url: process.env['LDAP_URL'] || 'ldap://127.0.0.1:389'
   url: process.env['LDAP_URL'] || 'ldap://10.0.60.24:389'
  });
  // const baseDn = process.env['BASE_DN'] || 'ou=Users,dc=example,dc=org';
  const baseDn = process.env['BASE_DN'] || 'ou=users,dc=project,dc=com';
  client.bind(process.env['BIND_CN'] || 'cn=admin,dc=project,dc=com', process.env['BIND_PASSWD'] || 'project.design',
    function(err) {

    if (err) {
      error(`Can't bind against LDAP`, err.message || err);
      renderForm(res, {
        login,
        incorrect: true
      });
      return;
    }

    const group = process.env['GROUP_CN'] || 'playground-gke,ou=groups,dc=project,dc=com';
    const opts = {
      filter: `(&(|(cn=${login})(uid=${login}))(memberOf=cn=${group}))`,
      scope: 'sub',
      attributes: ['cn', 'userPassword']
    };
    client.search(baseDn, opts, function(err, result) {
      if (err) {
        error(`Can't search against LDAP`, err.message || err);
        renderForm(res, {
          login,
          incorrect: true
        });
        return;
      }
      result.on('searchEntry', function(entry) {
        result.done = true;
        const userPassword = entry.object.userPassword;
        if (!userPassword || userPassword.substring(0, 5) !== '{MD5}') {
          error(`User ${login} password is not MD5 or not set`);
          renderForm(res, {
            login,
            incorrect: true
          });
          return;
        }
        const pass = Buffer.from(userPassword.substring(5), 'base64').toString('hex');
        if (pass !== md5(password)) {
          error(`User ${login} password is incorrect`);
          renderForm(res, {
            login,
            incorrect: true
          });
          return;
        }
        generateToken(req, res, login);
      });
      result.on('error', function(err) {
        error(err.message);
        if (!result.done) {
          result.done = true;
          renderForm(res, {
            login,
            incorrect: true
          });
        }
      });
      result.on('end', function(r) {
        if (!result.done) {
          result.done = true;
          renderForm(res, {
            login,
            incorrect: true
          });
        }
      });
    });

  });

});

app.listen(8080, () => log('LDAP cookie auth. server listening...'));

function generateToken(req, res, login) {
  const expireInMinutes = (+process.env['EXPIRE']) || (30 * 60);
  jwt.sign({login, exp: (Math.floor(Date.now() / 1000) + (expireInMinutes * 60))},
    process.env['JWT_SECRET'] || 'nginx123',
    (err, token) => {
      if (err) {
        error('Can not create JWT token for ${login}', err.message || err);
        renderForm(res, {
          login,
          incorrect: true
        });
        return;
      }

      log(`Authenticated ${login}`);

      let d = new Date();
      d.setTime(d.getTime() + (expireInMinutes * 60 * 1000));
      res.cookie(process.env['COOKIE_NAME'] || 'nginxauthjwt', token,
        {maxAge: (expireInMinutes * 60 * 60 * 1000), expires: d.toGMTString()});

      res.redirect('/');
    });
}

function log(...args) {
  args.unshift(Date().toString());
  console.log.apply(console, args);
}
function error(...args) {
  args.unshift(Date().toString());
  console.error.apply(console, args);
}
