/**
 * Blockchain storage service.
 * For saving/querying data about tx.
 * It's a pure in memory implementation.
 * It can be used in single instance mode for development only.
 */
'use strict';

const util = require('../../../util');

module.exports = function blockchainStorage() {
  const _txs = [];

  async function update(txRecord) {
    let record = _txs.find(r => r.id === txRecord.id);
    if (record) {
      record.status = txRecord.status;
      record.timestamp = txRecord.timestamp;
    } else {
      _txs.push(Object.assign({}, txRecord));
    }
  }

  async function get(id) {
    const txRecord = _txs.find(tx => tx.id === id);
    if (txRecord)
      return txRecord;
  }

  async function list(query) {
    return {
      data: _txs.filter(record => {
        if (record.status !== 'confirmed')
          return false;
        for (const key in query)
          if (record[key] !== query[key])
            return false;
        return true;
      }),
      timestamp: util.timestamp()
    };
  }

  return {
    update,
    get,
    list
  };
};

