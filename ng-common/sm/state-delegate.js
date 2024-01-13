'use strict';

module.exports = {
  init: (states, ctx) => {
    return {
      apply: (newState, payload) => {
        if (states[newState] && states[newState].apply) {
          return states[newState].apply.call(ctx || null, payload, newState);
        }
      }
    };
  }
};
