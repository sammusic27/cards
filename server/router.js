const users = require('./service/users/users').users;
const { messages } = require('./service/message');
const buildDeck = require('./service/common/operations').buildDeck;

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
    case 'user': user(ws, data); break;
    case 'dashboard': dashboard(ws, data); break;
    case 'room': room(ws, data); break;
    case 'game': game(ws, data); break;

    // old
    case 'ping': messages.send(ws,'ping', 'pong'); break;
    case 'clients':
      const keys = Object.keys(users.unauthorized);
      messages.send(ws,'clients', keys);
      break;
    case 'all':
      for (const key in users.unauthorized) {
        messages.send(ws,'message', data.message);
      }
      break;
    case 'build.deck':
      const deck = buildDeck['54']();
      messages.send(ws,'deck', deck);
      break;
  }
}

function user(ws, data){
  switch(data['$type']){
    case 'auth': users.authUser(ws, data); break;
  }
}

function dashboard(ws, data){
  switch(data['$type']){
    case 'rooms': users.authUser(ws, data); break;
  }
}

function room(ws, data){

}

function game(ws, data){

}

module.exports.router = router;
