const { messages } = require('../message');

const users = {
  rooms: {},
  // methods

  create: function(ws, data){
    const { room } = data;
    if(!room.name){

    }

    this.rooms[room.name] = room;
  },
  edit: function(ws, data){

  },
  remove: function(ws, data){

  },



};


module.exports.users = users;
