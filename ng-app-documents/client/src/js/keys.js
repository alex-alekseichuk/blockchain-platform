'use strict';

/* global Storage, XMLHttpRequest, localStorage, sodium, bs58, utils */

var KeysService = {

  status: 'no init',
  keyPairs: {},

  init: function(callback, forceReload) {
    var self = this;

    // already initialized
    if (typeof self.status === 'undefined') {
      if (forceReload)
        self.status = 'no init';
      else
        return callback();
    }

    // already failed to init.
    if (self.status !== 'in progress' && self.status !== 'no init') {
      return callback(self.status);
    }

    // callback-return when init. will be done
    self.bind('on_init', function() {
      callback(self.status);
    });

    // skip double initialization if init. is already running
    if (self.status === 'in progress')
      return;
    self.status = 'in progress';

    if (typeof (Storage) === "undefined") {
      self.status = 'not supported';
      return self.triggerUnbind('on_init');
    }

    // load public keys from server
    var xhr = new XMLHttpRequest();
    xhr.open('GET', '/keys', true);
    xhr.onreadystatechange = function() {
      if (xhr.readyState != 4)
        return;
      if (xhr.status != 200) {
        self.status = xhr.statusText;
        return self.triggerUnbind('on_init');
      }
      try {
        var keys = JSON.parse(xhr.responseText);
        if (keys && keys.length > 0) {
          self.keyPairs = {};

          // merge server public keys and client-side keypairs
          keys.forEach(function(key) {
            var b58PrvKey = localStorage.getItem(key.id + ".prvkey");
            var b58PubKey = localStorage.getItem(key.id + ".pubkey");
            if (b58PrvKey && b58PubKey && b58PubKey == key.key) {
              // register keypair in the working set
              self._putKeyIntoSet(key.id, {
                pubkey: b58PubKey,
                prvkey: b58PrvKey,
                name: key.name,
                default: key.default
              });
            }
          });
        }

        // if default key exists, then just return
        if (self.getDefault()) {
          self.status = undefined;
          return self.triggerUnbind('on_init');
        }

        // as there is no default key yet, generate and save the one
        self._generateDefaultKey(function(err) {
          self.status = err;
          return self.triggerUnbind('on_init');
        });
      } catch (exc) {
        self.status = exc;
        return self.triggerUnbind('on_init');
      }
    };
    xhr.send();
  },

  generate: function() {
    var keypair = sodium.crypto_sign_keypair();
    return {
      prvkey: bs58.encode(keypair.privateKey),
      pubkey: bs58.encode(keypair.publicKey)
    };
  },

  _generateDefaultKey: function(callback) {
    var self = this;
    var keypair = self.generate();
    var xhr = new XMLHttpRequest();
    var keyName = 'Default Key';
    var params = JSON.stringify({name: keyName, pubkey: keypair.pubkey, isdefault: true});
    xhr.open('POST', '/key', true);
    xhr.setRequestHeader("Content-type", "application/json");
    xhr.setRequestHeader("Charset", "utf-8");
    xhr.setRequestHeader('If-Modified-Since', 'Sat, 1 Jan 2000 00:00:00 GMT');
    xhr.setRequestHeader('Cache-Control', 'no-store,no-cache,must-revalidate,' +
      'post-check=0,pre-check=0,max-age=1,s-maxage=1');
    xhr.onreadystatechange = function() {
      if (xhr.readyState != 4)
        return;
      if (xhr.status != 200) {
        return callback(xhr.statusText);
      }
      try {
        var response = JSON.parse(xhr.response);
        self.saveKey(response.id, {
          name: keyName,
          pubkey: keypair.pubkey,
          prvkey: keypair.prvkey,
          default: true
        });
        callback();
      } catch (exc) {
        callback(exc);
      }
    };
    xhr.send(params);
  },

  _putKeyIntoSet: function(id, key) {
    this.keyPairs[id] = key;
  },

  saveKey: function(id, item) {
    this._putKeyIntoSet(id, item);

    if (typeof (Storage) === "undefined")
      return;

    // save into persistent storage
    localStorage.setItem(id + ".prvkey", item.prvkey ? item.prvkey : null);
    localStorage.setItem(id + ".pubkey", item.pubkey ? item.pubkey : null);
  },

  sign: function(id, plainText) {
    if (!this.keyPairs[id] || !this.keyPairs[id].prvkey)
      return null;
    return sodium.crypto_sign_detached(plainText, this.keyPairs[id].prvkey);
  },
  remove: function(id) {
    if (id in this.keyPairs) {
      delete this.keyPairs[id];
    }
    if (typeof (Storage) === "undefined")
      return;
    delete localStorage[id + ".prvkey"];
    delete localStorage[id + ".pubkey"];
  },
  getDefault: function() {
    var keys = this.getKeys();
    for (var i = 0; i < keys.length; i++) {
      if (keys[i] && keys[i].default)
        return keys[i];
    }
    return;
  },

  getKeys: function() {
    var self = this;
    return self.getArray(self.keyPairs);
  },

  getArray: function(obj) {
    return Object.keys(obj).map(function(value, index) {
      return {
        id: value,
        name: obj[value].name,
        pubkey: obj[value].pubkey,
        prvkey: obj[value].prvkey,
        default: obj[value].default
      };
    });
  },

  importKeys: function(keys, error, done) {
    var self = this;
    Object.keys(keys).forEach(function(key) {
      if (self.keyPairs[key]) {
        error(self.keyPairs[key].name + " already exist");
      } else {
        self.saveKey(key, keys[key]);
      }
    });
    done();
  }

};

utils.MicroEvent.mixin(KeysService);

KeysService.init(function() {});
