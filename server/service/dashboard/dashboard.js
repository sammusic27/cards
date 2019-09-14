const { messages } = require('../message');

const rooms = {
  rooms: {},
  // methods

  create: function(ws, data){
    const { room } = data;
    if(!room.name){
      messages.error(ws, 'Error: the name property is required!');
      return;
    }

    if(this.rooms[room.name]){
      messages.error(ws, 'Error: room with this name already exists. Please use other one.');
      return;
    }

    this.rooms[room.name] = room;
  },
  edit: function(ws, data){

  },
  remove: function(ws, data){

  },



};


module.exports.rooms = rooms;
