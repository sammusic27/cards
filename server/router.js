const { users } = require('./service/users/users');
const { rooms } = require('./service/rooms/rooms');
const { messages } = require('./service/message');
const { buildExtendDeck } = require('./utils/operations');

/**
 * Path contains 2 levels:
 * first:second
 *
 * @param ws
 * @param data
 */
function router(ws, data){
  const path = data['$type'].split('::');
  data = { ...data, '$type': path[1]};

  switch(path[0]){
    case 'users': return usersRouter(ws, data);
    case 'dashboard': return dashboard(ws, data);
    case 'rooms': return roomsRouter(ws, data);
    case 'game': return game(ws, data);

    // old
    case 'ping': messages.send(ws,'ping', 'pong'); return;
    case 'clients':
      const keys = Object.keys(users.unauthorized);
      messages.send(ws,'clients', keys);
      return;
    case 'all':
      for (const key in users.unauthorized) {
        messages.send(ws,'message', data.message);
      }
      return;
    case 'build.deck':
      const deck = buildExtendDeck();
      messages.send(ws,'deck', deck);
      return;
  }

  console.log('Error: No router path!', data);
  messages.error(ws, 'Error: No router path!');
}

function usersRouter(ws, data){
  switch(data['$type']){
    case 'auth': users.authUser(ws, data); return;
    case 'list': users.getUsers(ws, data); return;
    case 'one': users.getUser(ws, data); return;
    case 'create': users.create(ws, data); return;
    case 'edit': users.update(ws, data); return;
    case 'remove': users.delete(ws, data); return;
  }
}

function dashboard(ws, data){
  switch(data['$type']){

  }
}

function roomsRouter(ws, data){
  switch(data['$type']){
    case 'list': rooms.getList(ws, data); return;
    case 'one': rooms.getOne(ws, data); return;
    case 'connect': rooms.connect(ws, data); return;
    case 'disconnect': rooms.disconnect(ws, data); return;
    case 'create': rooms.create(ws, data); return;
    case 'edit': rooms.update(ws, data); return;
    case 'remove': rooms.delete(ws, data); return;
  }
}

function game(ws, data){

}

module.exports.router = router;
