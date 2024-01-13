/**
 * IoC/DI context implementation.
 * Almost all modules should be registered in the context, to be available later via DI.
 * Note: As an exception, common.util and other util modules can be used directly, because those have no dependencies.
 */
'use strict';

const util = require('../util');

/**
 * Create root/engine context.
 * @return {Object} Context interface
 */
function create() {
  return {
    /**
     * Create one more context based on current one.
     * It's for narrow functionality, authorized, scoped or customized context.
     * Basically, there is the root/engine context with common dependencies.
     * There would be scoped child context with specific implementations.
     * There would be data child context with specific data but use parent context services/dependencies.
     *
     * @param {Object} [dependencies] - A set of custom dependencies and settings/data for new context
     * @return {Object} Cloned child context
     */
    clone: function(dependencies) {
      const context = Object.create(this);
      if (dependencies)
        Object.assign(context, dependencies);
      return context;
    },

    /**
     * Added reference to object representing an interface of some dependency.
     * By default, it's added as a proxy, so, later you can update it.
     * Besides, you can override it in child context.
     *
     * @param {string} name - The name of the dependency
     * @param {Object} ref - The service to be added to the context
     * @return {Object} Current context
     */
    add: function(name, ref) {
      if (!this.hasOwnProperty(name)) {
        if (typeof ref === 'function') {
          this[name] = ref;
          return this;
        }
        const proxy = Object.create(ref);
        proxy.__proxy = true;
        this[name] = proxy;
        return this;
      }
      const existing = this[name];
      if (existing.__proxy) {
        Object.setPrototypeOf(existing, ref);
        return this;
      }
      this[name] = ref;
      return this;
    },

    /**
     * Inject arguments into factory function by their names.
     * Dependencies are getting from the context or from the dependencies parameter.
     *
     * @param {function} factory - Function to instantiate the instance with all dependencies
     * @param {Object} [dependencies] - Object with custom dependencies to override dependencies from the context
     * @return {Object} Returned by factory function
     */
    inject: function(factory, dependencies) {
      const self = this;
      if (!factory || typeof factory !== 'function')
        return null;
      const names = factory.__dependencies || util.getFuncArgs(factory);

      return factory.apply(this,
        names.map(name => {
          if (dependencies && typeof dependencies[name] !== 'undefined')
            return dependencies[name];
          if (name === 'context')
            return self;
          if (!self[name] && self.logger) {
            self.logger.warn(`Can't inject dependency: ${name}`);
          }
          return self[name];
        }));
    },

    /**
     * Instantiates the instance with dependencies and add it to the context.
     *
     * @param {any} factory - Function to instantiate the instance with all dependencies
     * @param {Object} [dependencies] - Object with custom dependencies to override dependencies from the context
     * @param {string} [name] - Custom name to use instead of original one
     * @return {Object} Current context
     */
    reg: function(factory, dependencies, name) {
      const self = this;

      if (typeof factory !== 'function') {
        if (name)
          self._add(name, factory);
        else if (factory.__name)
          self._add(factory.__name, factory);
        else if (factory.__components)
          self._add(null, factory);
        return self;
      }
      const ref = this.inject(factory, dependencies);
      if (!ref)
        return self;

      if (typeof ref.then === 'function') {
        const _name = name || factory.__name || factory.name;
        return ref
          .then(instance => {
            if (instance){
              self._add(_name, instance);
            } else {
              if (this.logger)
                this.logger.error(`Can't inject ${_name}`, 'common:context');
            }
            return self;
          })
          .catch(err => {
            if (this.logger)
              this.logger.error(`Can't inject ${_name}`, 'common:context');
          });
      }

      const _name = name || factory.__name || factory.name;
      if (!ref) {
        if (this.logger)
          this.logger.error(`Can't inject ${_name}`, 'common:context');
        return this;
      }
      this._add(_name, ref);
      return self;
    },

    /**
     * Asynchronous version of load method.
     * @param {function} factory - Factory function
     * @param {Object} [dependencies] - Custom dependencies
     * @param {string} [name] - Custom name
     * @return {Promise<context>} Current context
     * @see load method
     */
    regAsync: async function(factory, dependencies, name) {
      if (typeof factory !== 'function') {
        if (name)
          this._add(name, factory);
        else if (factory.__name)
          this._add(factory.__name, factory);
        else if (factory.__components)
          this._add(null, factory);
        return this;
      }

      let ref;
      try {
        ref = await this.inject(factory, dependencies);
      } catch (err) {
        if (this.logger)
          logger.error(err.toString(), 'common:context');
          logger.error(err.stack, 'common:context');
      }

      const _name = name || factory.__name || factory.name;
      if (!ref) {
        if (this.logger)
          this.logger.error(`Can't inject ${_name}`, 'common:context');
        return this;
      }
      this._add(_name, ref);
      return this;
    },

    /**
     * Add single component or a set of interfaces from __components property
     * @param {string} name - the name of single component
     * @param {Object} ref - main component
     * @private
     */
    _add: function(name, ref) {
      if (ref.__components) {
        for (let [key, value] of Object.entries(ref.__components))
          this.add(key, value);
        return;
      }
      if (name)
        this.add(name, ref);
    }
  };
}

module.exports = {
  create
};
