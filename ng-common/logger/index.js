/**
 * Logger interface
 * Logger is a first module/dependency you should add to the context after creation.
 *
 * level: trace, debug, info, warn, error
 *   logs should be filtered by level, to avoid forwarding upper level messages to appender
 *   info is default level for production?
 * path: '', 'common', 'common-browser/storage', 'app1/routes/keys', 'lib1/services/keys'
 *  set in concrete file
 * domain: '', 'app1', 'app1:customer1'
 *  inherited context added sub-domain in its logger
 * timestamp: ?
 * message: text string
 * client, session, request
 *
 * There are 2 ways how to get logger:
 * 1) once on factory level;
 *  it's used in route handlers;
 *  it's in the same context, so, it has the same domain.
 *    const _logger = context.logger;
 *    const _logger = context.logger.get(':plugin1/routes/user');
 * 2) all the time on service method call level;
 *  it's used in service methods;
 *  it's in dynamic context, so, it can vary the domain.
 *    const _logger = ctx.logger;
 *    const _logger = ctx.logger.get(':plugin1/routes/user');
 *
 * _logger = logger.get('common:util/clientIdUtil');
 * _logger.debug(ctx, 'init done');
 * _logger.debug('init done');
 */
'use strict';

const util = require('../util');

const noneAppender = {
  log: () => {}
};
const consoleAppender = {
  log: (ctx, level, timestamp, path, domain, message) => {
    console.log(formatLog(ctx, level, timestamp, path, domain, message));
  }
};

module.exports = function logger(appender, path, domain) {
  appender = appender || consoleAppender;
  path = path || '';
  if (!path)
    path = '';
  if (!domain)
    domain = '';
  const _logger = {
    get: (_path, _domain) => {
      let newDomain = _domain;
      if (!newDomain)
        newDomain = domain;
      else if (newDomain[0] === ':')
        newDomain = domain + newDomain;
      return logger(appender, _path || path, newDomain);
    },
    trace: _log.bind(this, 'TRACE'),
    debug: _log.bind(this, 'DEBUG'),
    info: _log.bind(this, 'INFO'),
    warn: _log.bind(this, 'WARNING'),
    error: _log.bind(this, 'ERROR')
  };
  function _log(level, ctx, message, _path) {
    if (typeof ctx !== 'object') {
      _path = message;
      message = ctx;
      ctx = {};
    }
    appender.log(ctx, level, new Date(), _path || path, domain, message);
  }
  return _logger;
};

module.exports.noneAppender = noneAppender;
module.exports.consoleAppender = consoleAppender;

function formatLog(ctx, level, timestamp, path, domain, message, params) {
  params = params || {};
  return `${util.formatDatetimeMs(timestamp)} ${level} ${path || '-'} ${domain || '-'} ${ctx.client || '-'}:${ctx.session || '-'}:${ctx.request || '-'} ${message}`;
}
