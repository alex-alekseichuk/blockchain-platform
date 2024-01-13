/**
 * Pure browser mechanism to prevent extra/accidental page refresh.
 * And close/clear/unregister or any other sync logic.
 */
'use strict';
/* eslint-disable no-undef */
let _locked = false;
let _unloadHandlers = [];
module.exports = function uiLock() {
  window.addEventListener('beforeunload', event => {
    if (_locked) {
      event.preventDefault();
      event.returnValue = '';
    }
  });
  window.addEventListener('unload', event => {
    _unloadHandlers.forEach(handler => handler());
  });
  return {
    lock: () => _locked = true,
    unlock: () => _locked = false,
    addUnload: handler => _unloadHandlers.push(handler)
  };
};
