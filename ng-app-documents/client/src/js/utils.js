'use strict';

/* global window, moment */

if (!window.utils) {
  window.utils = {};
}

var utils = window.utils;

utils.formatDatetime = function(timestamp) {
  return moment(timestamp * 1000).format('YYYY-MM-DD hh:mm:ss');
};

utils.MicroEvent	= function() {};
utils.MicroEvent.prototype	= {
  bind: function(event, fct) {
    this._events = this._events || {};
    this._events[event] = this._events[event]	|| [];
    this._events[event].push(fct);
  },
  unbind: function(event, fct) {
    this._events = this._events || {};
    if (event in this._events === false)	return;
    this._events[event].splice(this._events[event].indexOf(fct), 1);
  },
  trigger: function(event /* , args... */) {
    this._events = this._events || {};
    if (event in this._events === false)	return;
    for (var i = 0; i < this._events[event].length; i++) {
      this._events[event][i].apply(this, Array.prototype.slice.call(arguments, 1));
    }
  },
  triggerUnbind: function(event /* , args... */) {
    this._events = this._events || {};
    if (event in this._events === false)	return;
    var events = this._events[event];
    this._events[event] = [];
    for (var i = 0; i < events.length; i++) {
      events[i].apply(this, Array.prototype.slice.call(arguments, 1));
    }
  }
};

/**
 * mixin will delegate all MicroEvent.js function in the destination object
 *
 * - require('MicroEvent').mixin(Foobar) will make Foobar able to use MicroEvent
 *
 * @param {Object} destObject the object which will support MicroEvent
 * @return {Object} destination object
 */
utils.MicroEvent.mixin = function(destObject) {
  var props	= ['bind', 'unbind', 'trigger', 'triggerUnbind'];
  for (var i = 0; i < props.length; i++) {
    if (typeof destObject === 'function') {
      destObject.prototype[props[i]]	= utils.MicroEvent.prototype[props[i]];
    } else {
      destObject[props[i]] = utils.MicroEvent.prototype[props[i]];
    }
  }
  return destObject;
};
