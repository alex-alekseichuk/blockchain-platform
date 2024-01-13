/**
 * Domains manager service.
 * A domain has the name and the context.
 * We can get the context by the domain name.
 * Interfaces:
 *  1) domains is pure internal.
 *  2) domainsSetup is for admin role.
 */
'use strict';
module.exports = function domains(context, logger) {
  const _logger = logger.get('ng-rt-node:service/domains');
  const _contexts = {};
  return {
    __components: {
      domains: {
        getContext: domain => {
          if (_contexts[domain])
            return _contexts[domain];
          return context;
        }
      },
      domainsSetup: {
        regDomain: (domain, dependencies) => {
          dependencies.domain = domain;
          _contexts[domain] = context.clone(dependencies);
        }
      }
    }
  };
};
