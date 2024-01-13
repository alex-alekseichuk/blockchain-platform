/**
 * Blockchain cache service.
 * For saving/querying data about tx.
 * It's a pure in memory implementation.
 * It can be used in single instance mode for development only.
 */
'use strict';

const CACHE_TTL = 20000; // 20 seconds
const util = require('../../../util');

module.exports = function blockchainCache() {
  const _cache = [];

  setInterval(() => {
    const t = util.timestamp();
    let i = 0;
    while (i !== -1) {
      i = _cache.findIndex(r => t - r.timestamp > CACHE_TTL);
      if (i !== -1)
        _cache.splice(i, 1);
    }
  }, CACHE_TTL);

  async function update(tx) {
    let record = _cache.find(r => r.id === tx.id);
    if (record) {
      record.status = tx.status;
      record.timestamp = tx.timestamp;
    } else {
      _cache.push(Object.assign({}, tx));
    }
  }
  async function get(id) {
    const tx = _cache.find(tx => tx.id === id);
    if (tx)
      return tx;
  }
  async function listLatest(tsFrom, tsTo, query) {
    const data = (tsTo ?
      _cache.filter(record =>  tsFrom < record.timestamp && record.timestamp < tsTo) :
      _cache.filter(record =>  tsFrom < record.timestamp)
    )
    .filter(record => {
      for (const key in query)
        if (record[key] !== query[key])
          return false;
      return true;
    });

    return {
      data,
      timestamp: util.timestamp()
    };
  }

  return {
    update,
    get,
    listLatest
  };
};
