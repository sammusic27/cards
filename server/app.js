const WebSocketServer = new require('ws');

const { parseData, messages } = require('./service/message');
const users = require('./service/users/users').users;
const router = require('./router').router;

// WebSocket-server
const webSocketServer = new WebSocketServer.Server({
    port: 3031
});

webSocketServer.on('connection', function(ws) {
    const id = users.initUser(ws);
    messages.send(ws,'unauth', id);

    ws.on('message', function(message, a) {
        const data = parseData(message);
        if(!data) return;
        router(ws, data);
    });

    ws.on('close', function(err) {
        users.removeUser(ws, { id });
    });

    ws.on('error', function (msg) {
        console.log(msg)
    });
});
