const WebSocketServer = new require('ws');

const { parseData, messages } = require('./service/message');
const { users } = require('./service/users/users');
const router = require('./router').router;
const port = 3031;

require('./utils');

function noop() {}

function heartbeat() {
    this.isAlive = true;
}

// WebSocket-server
const webSocketServer = new WebSocketServer.Server({
    port: port
});

webSocketServer.on('connection', function(ws) {
    // init is alive
    ws.isAlive = true;
    ws.on('pong', heartbeat);

    const id = users.initConnection(ws);
    messages.send(ws,'users::unauth', id);
    console.log('open connection', id);

    ws.on('message', function(message) {
        const data = parseData(message);
        if(!data) {
            console.log('Error parsing data.', data);
            messages.error(ws, 'Error parsing data.');
            return;
        }
        console.log('router debug', data);

        router(ws, data);
    });

    ws.on('close', function(err) {
        console.log('close connection', id);
        users.delete(ws, { message: { id } });
    });

    ws.on('error', function (msg) {
        console.log('error', msg)
    });
});

// detect stack connections
const interval = setInterval(function ping() {
    webSocketServer.clients.forEach(function each(ws) {
        if (ws.isAlive === false) return ws.terminate();

        ws.isAlive = false;
        ws.ping(noop);
    });
}, 30000);

console.log('Server has been run on ' + port + ' port');
