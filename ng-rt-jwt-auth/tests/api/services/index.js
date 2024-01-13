'use strict';

const services = require('../../../server/services');
const logger = require('log4js').getLogger('ng-rt-jwt-auth.routes');
const _ = require('lodash');

module.exports = () => {
  let service = services(
    {
      get: service =>
        _.get(
          {
            'jwt.accessTime': 60,
            'jwt.secret': "secret",
            'jwt.session_time': 120
          }, service, {})
    }
  );

  it('service._transparentToLogin', function(done) {
    this.timeout(20000);
    new Promise((res, rej) =>
      service._transparentToLogin({
        query: {
          url: '123'
        }
      }, {
        redirect: d => res(d)
      })
    )
      .then(data => {
        logger.debug(data);
        done();
      });
  });

  it('service._transparentToUrl', function(done) {
    this.timeout(20000);
    new Promise((res, rej) =>
      service._transparentToUrl('123', {
        query: {
          url: '123'
        }
      }, {
        redirect: d => res(d)
      })
    )
      .then(data => {
        logger.debug(data);
        done();
      });
  });

  it('service._generateAccessTokenBySession', function(done) {
    this.timeout(20000);

    service._generateAccessTokenBySession('123',
      {
        cookie: d => {
        }
      })
      .catch(e => {
      })
      .then(data => {
        logger.debug(data);
        done();
      });
  });

  it('service._generateAndReplySessionToken', function(done) {
    this.timeout(20000);

    new Promise((res, rej) =>
      service._generateAndReplySessionToken({},
        {
          cookie: d => {
          },
          send: d => res(d)
        }, {
          remember_me: false
        })
    )
      .then(data => {
        logger.debug(data);
        done();
      });
  });
};
