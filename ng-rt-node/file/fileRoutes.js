/**
 * File HTTP API handlers.
 * For uploading and downloading files.
 * @requires express
 */
'use strict';

const express = require('express');
const prefix = '';

module.exports = function fileRoutes(logger, fileService, httpServer, httpContext) {
  const _logger = logger.get('ng-rt-node:file/fileRoutes');

  /**
   * Save a file content.
   *
   * @name Save file content.
   * @route {POST} /${namespace}/files/
   * @bodyparam {binary content} content - content of the file
   * @authentication Requires valid access token
   * @returnparam {object} file info, [status] 200 = OK  500 = Error
   */
  httpServer.post(`${prefix}/files/`, httpContext, express.raw({limit: '120mb'}),
    async (req, res, next) => {
      try {
        const fileInfo = await fileService.writeFile(req.context, {
          filename: req.header('X-Filename'),
          size: +req.header('X-Filesize'),
          blockSize: +req.header('X-Blocksize'),
          blocksNum: +req.header('X-BlocksNum')
        }, req.body);

        res.send(fileInfo);
        next();
      } catch (err) {
        next(err);
      }
    });

  /**
   * Save a block of the file content.
   *
   * @name Save a block of the file content.
   * @route {POST} /${namespace}/files/
   * @bodyparam {binary content} content - content of the file
   * @authentication Requires valid access token
   * @returnparam {object} file info, [status] 200 = OK  500 = Error
   */
  httpServer.post(`${prefix}/files/:fileId/`, httpContext, express.raw({limit: '120mb'}),
    async (req, res, next) => {
      try {
        const foundFile = await fileService.writeBlock(req.context, {
          fileId: req.params.fileId,
          block: +req.header('X-Block')
        }, req.body);
        res.status(foundFile ? 200 : 404).end();
        next();
      } catch (err) {
        next(err);
      }
    });

  /**
   * Load file content.
   *
   * @name Load file content.
   * @route {GET} /${namespace}/files/:fileId/
   * @queryparam {String} fileId - ID of the file
   * @authentication Requires valid access token
   * @returnparam {binary} file content, [status] 200 = OK  500 = Error
   */
  httpServer.get(`${prefix}/files/:fileId/`, httpContext, async (req, res, next) => {
    let fileInfo, buffer;
    try {
      fileInfo = await fileService.getFileInfo(req.context, req.params.fileId);
      if (!fileInfo) {
        res.status(404).end();
        return next();
      }
      buffer = await fileService.readBlock(req.context, {
        fileId: req.params.fileId
      });
    } catch (err) {
      return next(err);
    }

    if (fileInfo.filename) {
      res.header('Content-disposition', `attachment; filename=${fileInfo.filename}`);
      res.header('X-Filename', fileInfo.filename);
    }
    if (fileInfo.size) {
      res.header('X-Filesize', fileInfo.size);
    }
    _replyBlock(res, fileInfo, buffer);
    next();
  });

  /**
   * Load a block of file content.
   *
   * @name Load a block of file content.
   * @route {GET} /${namespace}/files/:fileId/:block/
   * @queryparam {String} fileId - ID of the file
   * @authentication Requires valid access token
   * @returnparam {binary} file content, [status] 200 = OK  500 = Error
   */
  httpServer.get(`${prefix}/files/:fileId/:block`, httpContext, async (req, res, next) => {
    const block = +req.params.block;
    let fileInfo, buffer;
    try {
      fileInfo = await fileService.getFileInfo(req.context, req.params.fileId);
      if (!fileInfo || block >= fileInfo.blocksNum) {
        res.status(404).end();
        return next();
      }
      buffer = await fileService.readBlock(req.context, {
        fileId: req.params.fileId,
        block
      });
    } catch (err) {
      return next(err);
    }
    _replyBlock(res, fileInfo, buffer);
    next();
  });

  function _replyBlock(res, fileInfo, buffer) {
    if (fileInfo.blockSize)
      res.header('X-Blocksize', fileInfo.blockSize);
    if (fileInfo.blocksNum)
      res.header('X-BlocksNum', fileInfo.blocksNum);
    res.header('Content-type', fileInfo.type || 'application/octet-stream');
    // res.header('Content-Length', buffer.length);
    res.send(buffer);
  }

  /**
   * Save file as a stream.
   *
   * @name Save file as a stream.
   * @route {POST} /${namespace}/files/
   * @bodyparam {binary content} content - content of the file
   * @authentication Requires valid access token
   * @returnparam {object} file info, [status] 200 = OK  500 = Error
   */
  httpServer.post(`${prefix}/stream/`, httpContext, async (req, res, next) => {
    try {
      const fileInfo = await fileService.writeStream(req.context, {
        filename: req.header('X-Filename'),
        size: +req.header('X-Filesize')
      }, req);
      res.send(fileInfo);
      next();
    } catch (err) {
      next(err);
    }
  });

  /**
   * Load file content as a stream.
   *
   * @name Load file content as a stream.
   * @route {GET} /${namespace}/files/:fileId/
   * @queryparam {String} fileId - ID of the file
   * @authentication Requires valid access token
   * @returnparam {binary} file content, [status] 200 = OK  500 = Error
   */
  httpServer.get(`${prefix}/stream/:fileId/`, httpContext, async (req, res, next) => {
    let fileInfo, stream;
    try {
      fileInfo = await fileService.getFileInfo(req.context, req.params.fileId);
      if (!fileInfo) {
        res.status(404).end();
        return next();
      }
      stream = await fileService.readStream(req.context, req.params.fileId);
    } catch (err) {
      return next(err);
    }

    if (fileInfo.filename) {
      res.header('Content-disposition', `attachment; filename=${fileInfo.filename}`);
      res.header('X-Filename', fileInfo.filename);
      res.header('Access-Control-Expose-Headers', 'X-Filename');
    }
    res.header('Content-type', fileInfo.type || 'application/octet-stream');
    if (fileInfo.size)
      res.header('Content-Length', fileInfo.size);
    stream.pipe(res);
    next();
  });
};
