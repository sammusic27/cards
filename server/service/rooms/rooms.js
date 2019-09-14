const { messages } = require('../message');
const cloneDeep = require('lodash/cloneDeep');
const uniqueId = require('lodash/uniqueId');

const ROLE_ADMIN = 'ADMIN';
const ROLE_MODERATOR = 'MODERATOR';
const ROLE_USER = 'USER';

const STATUS_ACTIVE = 'active';
const STATUS_DISABLED = 'disabled';
const STATUS_HIDE = 'hide';

function getId(){
  return uniqueId('room');
}

function createRoom(name = '', pass = '', status = STATUS_ACTIVE, users = {}) {
  const id = getId();
  name = name ? name : id;

 return {
   id,
   name,
   pass,
   users,
   status
 };
}

const room = createRoom('First Test Room');

const db = {
  [room.id]: room
};

const rooms = {
  list: cloneDeep(db),
  getList: function(ws, data){
    messages.send(ws, 'rooms::list', this.list);
  },
  getOne: function(ws, data){
    const { id } = data.message;
    const found = this.list[id];

    if(!found){
      messages.error(ws, 'Error: This room is not found');
      return;
    }

    messages.send(ws, 'rooms::one', found);
  },

  connect: function(ws, data){
    const { id, user } = data.message;
    const found = this.list[id];

    if(!found){
      messages.error(ws, 'Error: This room is not found');
      return;
    }

    found.users[user.id] = user.name;

    messages.send(ws, 'rooms::list', this.list);
  },

  disconnect: function(ws, data){
    const { id, user } = data.message;
    const found = this.list[id];

    if(!found){
      messages.error(ws, 'Error: This room is not found');
      return;
    }

    delete found.users[user.id];

    messages.send(ws, 'rooms::list', this.list);
  },

  create: function(ws, data){
    const { name, pass = '', status = STATUS_ACTIVE } = data.message;
    if(name){
      const list = cloneDeep(db);
      const room = createRoom(name, pass, status);
      list[room.id] = room;
      return;
    }
    messages.error(ws, 'Error: Can\'t create room without name.');
  },
  update: function(ws, data){
    const { id } = data.message;

    if(!this.list[id]){
      messages.error(ws, 'Error: Room not found.');
      return;
    }
    this.list[id] = data.message;
  },

  delete: function(ws, data){
    const { id } = data.message;

    if(!this.list[id]){
      messages.error(ws, 'Error: Room not found.');
      return;
    }

    delete this.list[id];
  },

};


module.exports.rooms = rooms;
