/**
 * Api for
 *  1) posting tx into blockchain
 *  2) get tx from blockchain via storage/cache
 * It's based on HTTP and websocket.
 *
 * TODO: look at listener and watcher. there is a lot of common code. maybe refactor it?
 * TODO: listenTx: maybe use rx.js instead of pure callback, or both?
 *
 * @param {Object} config - Client config
 * @param {Object} sessionHttp - Http client interface with auth.
 * @param {Object} websocket - Websocket interface.
 * @return {object} interface to Blockchain HTTP API to load the config from the server.
 */
'use strict';

const util = require('../util');
const apiUtils = require('./util');

const TX_PULL_DELAY = 3000;
const CACHE_TTL = 10000; // 10 seconds

const apiFactory = function apiBlockchain(logger, config, sessionHttp, websocket) {
  const _logger = logger.get('common:api/apiBlockchain');
  const httpConfig = (config && config.api) ? config.api.blockchain : null; // TODO: refactor this?
  const paramsConfig = params => params ? Object.assign({params}, httpConfig) : httpConfig;
  const api = {
    postTx: async signedTx => {
      try {
        return (await sessionHttp.post('blockchain/', signedTx, httpConfig)).data
      } catch (response) {
        apiUtils.handleResponse(response, _logger);
      }
    },
    getTx: async id => {
      try {
        return (await sessionHttp.get(`blockchain/storage/${id}`, httpConfig)).data;
      } catch (response) {
        apiUtils.handleResponse(response, logger, {
            '404': () => {
              _logger.warn(`Unknown transaction ${id}`);
              throw new apiUtils.ApiError(apiFactory.UNKNOWN_TX);
            }
          }
        );
      }
    },
    getTxFromCache: async id => {
      try {
        return (await sessionHttp.get(`blockchain/cache/${id}`, httpConfig)).data
      } catch (response) {
        apiUtils.handleResponse(response, logger, {
            '404': 'ignore'
          }
        );
      }
    },
    listTx: async query => {
      try {
        return (await sessionHttp.get(`blockchain/storage/`, paramsConfig(query))).data;
      } catch (response) {
        apiUtils.handleResponse(response, logger);
      }
    },

    /**
     * Get list of tx records from the cache since specific timestamp
     * @param lastTimestamp
     * @returns {Promise<Array<Tx>>} resolves array of tx records
     */
    listLastTx: async (query, lastTimestamp) => {
      try {
        query.tsFrom = lastTimestamp;
        return (await sessionHttp.get(`blockchain/cache/`, paramsConfig(query))).data;
      } catch (response) {
        logger.error(response);
        apiUtils.handleResponse(response, logger);
      }
    },

    // facade of the general waitTx interface
    waitTx: async (id, lastTimestamp) => {
      if (websocket)
        return await api.waitTxWs(id, lastTimestamp);
      return await api.waitTxHttp(id, lastTimestamp);
    },
    waitTxWs: (id, lastTimestamp) => {
      const query = {id};
      const key = queryKey(query);
      return new Promise(_resolve => {
        let clear = setTimeout(() => {
          clear = null;
          resolve(null);
        }, CACHE_TTL * 2);
        const open = () => {
          _logger.trace(`send listenTx ${lastTimestamp}`);
          websocket.send({msg: 'listenTx', query, key, lastTimestamp});
        };
        const onTx = message => {
          if (message.keys.indexOf(key) !== -1)
            resolve(message.tx);
        };
        const onTxs = message => {
          if (message.key === key && message.data && message.data.length > 0)
            resolve(message.data[0]);
        };
        websocket.on('tx', onTx);
        websocket.on('txs', onTxs);
        websocket.on('open', open);
        if (websocket.connected)
          open();
        function resolve(txRecord) {
          if (txRecord && txRecord.id !== id)
            return;
          if (clear) {
            clearTimeout(clear);
            clear = null;
          }
          websocket.send({msg: 'stopListenTx', query});
          websocket.removeListener('tx', onTx);
          websocket.removeListener('txs', onTxs);
          websocket.removeListener('open', open);
          _resolve(txRecord);
        }
      });
    },
    waitTxHttp: async (id, lastTimestamp) => {
      // TODO: use lastTimestamp for get old tx from storage instead of cache
      let data = await api.getTxFromCache(id);
      let period = 500;
      while (!data || data.status !== 'confirmed') {
        // TODO: add random delay delta not more then period/4
        await util.delay(period);
        data = await api.getTxFromCache(id);
        period *= 3;
        if (period > CACHE_TTL)
          return null;
      }
      return data;
    },

    // facade of the general listenTx interface
    listenTx: (query, lastTimestamp, cb) => websocket ?
      api.listenTxWs(query, lastTimestamp, cb) : api.listenTxHttp(query, lastTimestamp, cb),

    // listenTx approach implemented on websocket
    listenTxWs: (query, lastTimestamp, cb) => {
      const key = queryKey(query);
      // _logger.trace(`key: ${key}, query: ${JSON.stringify(query)}`);
      // TODO: use rx.js instead of cb?
      if (!cb) {
        cb = lastTimestamp;
        lastTimestamp = null;
      }

      let savedTxs = []; // temporary saved tx records in closed mode
      let waiting;
      const open = () => {
        _logger.trace(`send listenTx ${lastTimestamp} key: ${key}`);
        if (lastTimestamp)
          waiting = true;

        websocket.send({msg: 'listenTx', query, key, lastTimestamp});
      };
      const onTx = message => {
        _logger.trace(`listenTxWs.onTx ${message.keys} ${message.tx.id}  ${message.tx.timestamp}`);
        if (message.keys.indexOf(key) === -1)
          return;
        _updateTimestamp(message.tx.timestamp);
        if (waiting) {
          savedTxs.push(message.tx);
        } else {
          cb(message.tx);
        }
      };
      const onTxs = message => {
        if (message.key !== key)
          return;
        _logger.trace(`listenTxWs.onTxs ${message.key} ${message.data ? message.data.length : 'no records'} \
${message.timestamp}`);
        _updateTimestamp(message.timestamp);
        if (waiting) {
          const allTxs = message.data ? message.data.concat(savedTxs) : savedTxs;
          savedTxs = [];
          allTxs.forEach(tx => {
            _updateTimestamp(tx.timestamp);
            cb(tx);
          });
          waiting = false;
        } else {
          if (message.data)
            message.data.forEach(tx => {
              _updateTimestamp(tx.timestamp);
              cb(tx);
            });
        }
      };
      websocket.on('tx', onTx);
      websocket.on('txs', onTxs);
      websocket.on('open', open);
      if (websocket.connected)
        open();
      return {
        // interface for closing the listener
        close: () => {
          websocket.send({msg: 'stopListenTx', query});
          websocket.removeListener('tx', onTx);
          websocket.removeListener('txs', onTxs);
          websocket.removeListener('open', open);
        }
      };
      function _updateTimestamp(timestamp) {
        if (lastTimestamp < timestamp)
          lastTimestamp = timestamp;
      }
    },

    // listenTx interface implemented by pure HTTP calls
    listenTxHttp: (query, lastTimestamp, cb) => {
      if (!cb) {
        cb = lastTimestamp;
        lastTimestamp = null;
      }
      if (!lastTimestamp)
        lastTimestamp = util.timestamp();

      let _resolve;
      let listening = true;
      (async () => {
        // periodically get next batch of tx records
        while (listening) {
          try {
            const data = await api.listLastTx(query, lastTimestamp);
            if (!listening) {
              _resolve();
              return;
            }
            lastTimestamp = data.timestamp;
            if (cb && data.data && data.data.length > 0)
              data.data.forEach(data => cb(data));
          } catch (err) {
            _logger.error(`Can't get the latest transactions: ${err.message}`);
          }
          await util.delay(TX_PULL_DELAY);
        }
      })();

      return {
        // interface for closing the listener
        close: () => {
          if (_resolve)
            return;
          return new Promise(resolve => {
            _resolve = resolve;
            listening = false;
          });
        }
      };
    }
  };
  return api;
};

Object.assign(apiFactory, apiUtils.enumApiErrors([
  'UNKNOWN_TX'
]));

module.exports = apiFactory;

function queryKey(query) {
  if (!query)
    return util.generateShortId();
  const keys = Object.keys(query);
  if (keys.length === 0)
    return util.generateShortId();
  return util.generateShortId() + '-' + keys.sort().map(key => `${key}=${query[key]}`).join(',');
}