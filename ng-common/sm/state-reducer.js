'use strict';

module.exports = {
  init: (states, ctx) => {
    return {
      reduce: (currentState, action, payload) => {
        let _action;
        if (states[currentState] && states[currentState].actions && states[currentState].actions[action])
          _action = states[currentState].actions[action];
        else if (states['*'] && states['*'].actions && states['*'].actions[action])
          _action = states['*'].actions[action];

        if (!_action)
          return null;

        if (typeof _action === 'string') // simple: returns new state
          return _action;

        if (typeof _action === 'function') {
          return _action.call(ctx || null, payload, currentState);
        }
      }
    };
  }
};
