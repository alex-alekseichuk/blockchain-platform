/**
 * Common Blockchain HTTP API handlers for posting tx
 * @requires httpServer
 * @requires blockchain
 */
'use strict';

const httpProfix = '';

module.exports = function blockchainRoutes(logger, blockchain, httpServer, httpContext) {
  const _logger = logger.get('ng-rt-node:blockchain/blockchainRoutes');

  /**
   * Post a tx.
   *
   * @name Post tx
   * @route {POST} /blockchain/
   * @bodyparam {JSON} signedTx - the tx to post
   * @authentication Requires valid authorization?
   * @returnparam {JSON} tx, [status] 200 = OK  500 = Error
   */
  httpServer.post(`${httpProfix}/blockchain`, httpContext, httpServer.jsonParser, async (req, res, next) => {
    try {
      const data = await blockchain.postTx(req.context, req.body);
      res.send(data);
      next();
    } catch (err) {
      next(err);
    }
  });
};
