/**
 * Menu API.
 * It's a public API.
 * It's used by client to load menu configured by admin.
 * TODO: move it to browser?
 *
 * {
      menu: [
        {title: 'Admin', url: '/admin/'},
        {title: 'Create TX', url: '/app-tx/#!/create/'},
        {title: 'Transfer TX', url: '/app-tx/#!/transfer/'}
      ]
    }

  It's not used for now.
 */
'use strict';

module.exports = function apiMenu(config, sessionHttp) {
  const httpConfig = config.api.keys;
  return {
    load: async function menu() {
      return (await sessionHttp.get('/api-menu', httpConfig)).data;
    }
  };
};
