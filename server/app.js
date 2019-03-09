const WebSocketServer = new require('ws');
const buildDeck = require('./service/common/operations').buildDeck;

// подключенные клиенты
const clients = {};

// WebSocket-сервер на порту 8081
const webSocketServer = new WebSocketServer.Server({
    port: 3031
});
webSocketServer.on('connection', function(ws) {
    const id = Math.random();
    clients[id] = ws;
    console.log("новое соединение " + id);

    ws.on('message', function(message, a) {
        console.log('получено сообщение ' + message);

        const data = parseData(message);
        if(!data) return;

        detectType(data, ws);

    });

    ws.on('close', function() {
        console.log('соединение закрыто ' + id);
        delete clients[id];
    });

    ws.on('error', function (msg) {
        console.log(msg)
    });
});

function parseData(request){
    let data;
    try{
        data = JSON.parse(request);
        if(!data['$type']){
            data = null;
        }
    }catch(e){
        console.log('error by ' + request, e);
    }

    return data;
}


function detectType(data, ws){
    switch(data['$type']){
        case 'ping': ws.send(JSON.stringify({'$type': 'ping', 'message': 'pong'})); break;
        case 'clients':
            const keys = Object.keys(clients);
            ws.send(JSON.stringify({'$type': 'clients', 'message': keys}));
            break;
        case 'all':
            for (const key in clients) {
                clients[key].send(JSON.stringify({'$type': 'message', message: data.message}));
            }
            break;
        case 'build.deck':
            const deck = buildDeck['54']();
            ws.send(JSON.stringify({'$type': 'deck', 'deck': deck}));
            break;
    }
}
