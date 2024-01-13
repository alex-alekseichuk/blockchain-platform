'use strict';

const logger = require('log4js').getLogger('ng-rt-jwt-auth.routes');
const _ = require('lodash');

module.exports = (routes, params, custom) => {
  let points = [];

  routes.activate(_.merge({

    get: (route, ...funcs) => {
      logger.debug(`route: ${route}`);
      points.push({route: route, func: _.last(funcs)});
    },

    post: (route, ...funcs) => {
      logger.debug(`route: ${route}`);
      points.push({route: route, func: _.last(funcs)});
    }
  }, custom));

  _.chain(points)
    .forEach(point => {
      let promise = new Promise((res, rej) => {
        _.merge(params[point.route],
          {
            res: {
              send: d => res(d),
              redirect: d => res(d),
              status: s => {
                return {
                  end: d => res({status: s, send: d}),
                  send: d => res({status: s, send: d}),
                  json: d => res({status: s, send: d})
                };
              },
              end: () => res(),
              sendStatus: s =>
                res({status: s})
            }
          }
        );
        point.func.call(null, params[point.route].req, params[point.route].res);
      });

      it(`route: ${point.route}`, function(done) {
        this.timeout(20000);
        promise.then(data => {
          logger.debug(data);
          done();
        });
      });
    }, [])
    .value();
};
