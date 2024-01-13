/**
 * Dummy Blockchain HTTP interface
 */
'use strict';

const prefix = '';

module.exports = function dummyRoutes(logger, blockchain, httpServer, httpContext) {
  /**
   * Post a tx.
   *
   * @name Post tx.
   * @route {POST} /blockchain/
   * @bodyparam {JSON} signedTx - the tx to post
   * @authentication Requires valid authorization?
   * @returnparam {string} txId, [status] 200 = OK  500 = Error
   */
  httpServer.post(`${prefix}/blockchain/dummy`, httpContext, httpServer.jsonParser, async (req, res, next) => {
    try {
      const data = await blockchain.postTx(req.context, req.body);
      res.send(data);
      next();
    } catch (err) {
      next(err);
    }
  });
};
