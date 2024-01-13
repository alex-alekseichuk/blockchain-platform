/**
 * State Machine is for design Web SPA.
 * It links Model/Service with Web SPA via Reducer.
 * SM uses Delegate to makes SPA framework agnostic.
 */
'use strict';

/**
 *
 * @param {[[type]]} reducer [[Description]]
 * @param {[[type]]} delegate [[Description]]
 * @param {[[type]]} initState [[Description]]
 * @param {[[type]]} initPayload [[Description]]
 * @return {[[type]]} [[Description]]
 */
function _init(reducer, delegate, initState, initPayload) {
  const instance = {
    state: initState
  };

  const _apply = (result, payload) => {
    if (!result)
      return;
    if (typeof result === 'string') {
      instance.state = result;
      return delegate.apply(instance.state, payload);
    }
    instance.state = result.state;
    return delegate.apply(instance.state, result.payload);
  };

  instance.action = (action, payload) => {
    const result = reducer.reduce(instance.state, action, payload);
    if (result && typeof result.then === 'function') {
      return result.then(result => {
        return _apply(result, payload);
      });
    }
    return _apply(result, payload);
  };

  setTimeout(() => {
    delegate.apply(instance.state, initPayload);
  }, 0);

  return instance;
}

module.exports = {
  init: (options, initState, initPayload, ctx) => {
    const reducer = options.reducer ||
      (options.states ? require('./state-reducer').init(options.states, ctx || null) : null);
    const delegate = options.delegate ||
      (options.states ? require('./state-delegate').init(options.states, ctx || null) : null);
    if (!reducer || !delegate)
      throw new Error('Incorrect SM initialization.');
    return _init(reducer, delegate, initState, initPayload);
  }
};
