/**
 * Common Blockchain HTTP API handlers for listening for tx
 */
'use strict';

const httpPrefix = '';

module.exports = function blockchainListRoutes(logger, blockchainList, httpServer, httpContext) {
  const _logger = logger.get('ng-rt-node:http/blockchainListenRoutes');

  /**
   * Get tx from storage by id.
   *
   * @name Get tx
   * @route {GET} /blockchain/storage/{id}
   * @bodyparam {string} id Tx ID
   * @authentication Requires valid authorization?
   * @returnparam {JSON} tx, [status] 200 = OK  500 = Error
   */
  httpServer.get(`${httpPrefix}/blockchain/storage/:id`, httpContext, async (req, res, next) => {
    try {
      const data = await blockchainList.getTx(req.context, req.params.id);
      if (!data)
        return res.status(404).end();
      res.send(data);
      next();
    } catch (err) {
      next(err);
    }
  });

  /**
   * Get tx from cache by id.
   *
   * @name Get tx
   * @route {GET} /blockchain/cache/{id}
   * @bodyparam {string} id ID of tx
   * @authentication Requires valid authorization?
   * @returnparam {JSON} tx, [status] 200 = OK  500 = Error
   */
  httpServer.get(`${httpPrefix}/blockchain/cache/:id`, httpContext, async (req, res, next) => {
    try {
      const data = await blockchainList.getTxFromCache(req.context, req.params.id);
      if (!data)
        return res.status(404).end();
      res.send(data);
      next();
    } catch (err) {
      next(err);
    }
  });

  /**
   * List tx records from storage.
   *
   * @name List txs
   * @route {GET} /blockchain/storage/
   * @authentication Requires valid authorization?
   * @returnparam Array<{JSON}> array of tx, [status] 200 = OK  500 = Error
   */
  httpServer.get(`${httpPrefix}/blockchain/storage/`, httpContext, async (req, res, next) => {
    try {
      const data = await blockchainList.listTx(req.context);
      res.send(data);
      next();
    } catch (err) {
      next(err);
    }
  });

  /**
   * List the latest tx from cache since timestamp.
   *
   * @name List latest tx
   * @route {GET} /blockchain/last/
   * @bodyparam {number} timestamp server-side moment when the previous call was done
   * @authentication Requires valid authorization?
   * @returnparam {Array<{JSON}>}, number} tx array and new timestamp, [status] 200 = OK  500 = Error
   */
  httpServer.get(`${httpPrefix}/blockchain/cache/`, httpContext, async (req, res, next) => {
    try {
      const query = Object.assign({}, req.query);
      delete query.tsFrom;
      delete query.tsTo;
      const data = await blockchainList.listLatestTx(req.context, req.query.tsFrom, req.query.tsTo, query);
      res.send(data);
      next();
    } catch (err) {
      _logger.error(`${httpPrefix}/blockchain/cache/ ${err.message}`);
      next(err);
    }
  });
};
