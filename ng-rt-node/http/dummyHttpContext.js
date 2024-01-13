/**
 * Dummy implementation of httpContext middleware.
 * It's for dev/test only.
 */
'use strict';

module.exports = function httpContext(domains) {
  return (req, res, next) => {
    const domain = 'demo';
    req.context = (domains.getContext(domain)).clone({
      userId: 1,
      domain
    });
    next();
  };
};
