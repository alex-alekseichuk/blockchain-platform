'use strict';

const logger = require('log4js').getLogger('app-documents-socket');

let getAllListener;

/**
 * On connect handler
 * @param {Object} socket Socket
 */
function onConnect(socket) {
  socket.on('documents.getall', (data, done) => getAllListener(data, done));
}

module.exports = {
  activate: (socketManager, services) => {
    logger.debug('activate docs. sockets');

    const service = services.get('docs.service');

    getAllListener = (data, done) => {
      service.getAll().then(records => {
        logger.info(records);
        return records;
      }).then(
        done
      );
    };

    // socketManager.subscribeToConnection(onConnect);
    // service.subscribe(docs => {
    //   socketManager.emit("documents", docs);
    // });
  },
  deactivate: (socketManager, services) => {
    socketManager.unsubscribeConnection(onConnect);
    // const service = services.get('docs.service');
    // service.unsubscribe();
  }
};
