'use strict';

const logger = require('log4js').getLogger('app-documents-routes');
const path = require('path');
const multer = require('multer');
const upload = multer({storage: multer.memoryStorage()});
const loopback = require('loopback');
// const removeRoute = require('express-remove-route');

let plgn;

/**
 * API/Route/DocumentsService
 *
 * @module API/Route/DocumentsService
 * @type {object}
 */

module.exports = {
  activate: (server, plugin, pluginInstance) => {
    plgn = plugin;

    logger.debug('activate docs. routes');

    let service = server.plugin_manager.services.get('docs.service');
    const pluginSettings = server.plugin_manager.configs.get(plugin);
    const namespace = pluginSettings.get('namespace');
    const pubkeysService = server.plugin_manager.services.get('pubkeys');

    server.use(`/${namespace}`, loopback.static(path.resolve(__dirname, '../../client/public')));

    server.use('/admin/' + plgn + '/locales',
      server.loopback.static(path.resolve(process.cwd(), 'plugins', plgn, 'locales')));

    /**
    * upload document's hash in order to save and post CREATE digital asset tx
    *
    * @name  upload document's hash in order to save and post CREATE digital asset tx
    * @route {POST} /${namespace}/upload-document
    * @authentication server.ensureLoggedIn() Vaild User session
    * @bodyparam {string} hash of the file to be verified
    * @bodyparam {string} ownerPubKey Publickey of te sender
    * @bodyparam {object} file Filename file, file.originalname, file.size
    */
    server.post(`/${namespace}/upload-document`, server.ensureLoggedIn(), upload.single('file'), (req, res, next) => {
      if (!req.file || !req.file.buffer) {
        return res.status(400).send({message: "No file"});
      }
      service.save(req.body.ownerPubKey, req.file.buffer, {
        filename: req.file.originalname,
        size: req.file.size,
        hash: req.body.hash
      })
        .then(body => {
          res.send(body);
        })
        .catch(err => {
          res.status(500).send(err);
        });
    });

   /**
   * upload document's hash to check if it's exists in Blockchain
   *
   * @name  upload document's hash to check if it's exists in Blockchain
   * @route {POST} /${namespace}/upload-document/verify
   * @authentication server.ensureLoggedIn() Vaild User session
   * @bodyparam {string} hash of teh file to be verified
   */
    server.post(`/${namespace}/upload-document/verify`, server.ensureLoggedIn(), upload.single('file'), (req, res) => {
      service.verify(req.body.hash)
        .then(exists => {
          res.send({exists: exists});
        })
        .catch(err => {
          res.status(500).send(err);
        });
    });

    /**
    * Get documents list
    *
    * @name  Get documents list
    * @route {POST} /${namespace}/documents_list
    * @authentication server.ensureLoggedIn() Vaild User session
    */
    server.get(`/${namespace}/documents_list`, server.ensureLoggedUser(), async(req, res) => {
      const publicKey = (await pubkeysService.getKeyByEmail(req.user.email)).key;
      const records = await service.getAll(publicKey);
      const filteredRecords = records.filter(item => {
        if (item && typeof item === 'object') {
          if (item.hash && item.filename && item.size && item.timestamp) return true;
        }
        return false;
      });
      res.end(JSON.stringify(filteredRecords));
    });
  },

  deactivate: (server, plugin, pluginInstance) => {
  /*  const pluginSettings = server.plugin_manager.configs.get(plugin);
    const namespace = pluginSettings.get('namespace');

    removeRoute(server, `/${namespace}/documents`);
    removeRoute(server, `/${namespace}/upload-document`);
    removeRoute(server, `/${namespace}/ng-app-documents/upload-document/verify`);
    removeRoute(server, '/admin/' + plgn + '/locales');*/
  }

};
