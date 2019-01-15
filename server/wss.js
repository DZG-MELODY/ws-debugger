const WebSocket = require('ws');

const logger = require('../lib/log.js');

const config = require('../config.js');

module.exports = function wss (server, db) {
  const wss = new WebSocket.Server({
    server
  });

  const uiList = [];

  wss.on('connection', function connection (ws) {
    setTimeout(() => {
      ws.send('welcome to ws debugger');
    }, 2000);
    ws.on('message', function receiveMsg (message) {
      let data = '';
      try {
        data = JSON.parse(message);
      } catch (error) {
        data = message;
      }

      if (typeof data === 'object') {
        if (data.type === 'init') {
          uiList.push(data.id);
        } else if (data.type === 'send' && uiList.indexOf(data.id) >= 0) {
          db.addHistory(data.message);
        }
      } else {
        console.log(`message:${message}`);
      }
    });
  });

  server.listen(config.ws_port, function () {
    logger.success('socket listening on 8080');
  });
};
