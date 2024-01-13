/**
 * Cookies based implementation of httpContext middleware.
 * It gets the session data from the cookies.
 * then create new req.context from the domain or common context,
 * and adds session data to req.context.
 */
'use strict';

const COOKIE = 'context';

module.exports = function httpContext(logger, domains) {
  const _logger = logger.get('ng-rt-node:http/cookiesHttpContext');
  return (req, res, next) => {
    let contextData = req.cookies[COOKIE];
    if (contextData) {
      try {
        contextData = JSON.parse(contextData);
      } catch (e) {
        _logger.error(`Incorrect ${COOKIE} cookies`);
      }
    }
    if (!contextData) {
      res.status(401).end();
      _logger.warn(`No ${COOKIE} cookies or expired`);
      next();
      return;
    }
    req.context = (domains.getContext(contextData.domain)).clone(contextData);
    next();
  };
};
