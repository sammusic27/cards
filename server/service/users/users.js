const { messages } = require('../message');
const cloneDeep = require('lodash/cloneDeep');
const uniqueId = require('lodash/uniqueId');

const ADMIN_ROLE = 'admin';
const USER_ROLE = 'user';

function getId(){
  return uniqueId('user');
}

const db = [
  {
    id: getId(),
    name: 'Admin',
    role: ADMIN_ROLE,
    login: 'admin',
    pass: 'admin',
  },
  {
    id: getId(),
    name: 'Test User 1',
    role: USER_ROLE,
    login: 'test',
    pass: 'test'
  }
];

const users = {
  unauthorized: {},
  authorized: {},
  // methods

  // user authentication methods
  initConnection: function(ws){
    const id = getId();
    this.unauthorized[id] = {
      ws
    };
    return id;
  },
  authUser: function(ws, data){
    const { id, login, pass } = data.message;
    const userList = cloneDeep(db);
    const found = userList.find(u => u.login === login && u.pass === pass);

    if(found && this.unauthorized[id]){
      this.authorized[id] = this.unauthorized[id];
      this.authorized[id].data = found;
      delete this.unauthorized[id];
      messages.send(ws, 'users::auth', found);
    } else {
      const message = 'Error: Login or Password are not correct!';
      messages.error(ws, message);
    }
  },
  getUsers: function(ws, data){
    // TODO: make some sort or filters using data
    messages.send(ws, 'users::list', this.authorized);
  },
  getUser: function(ws, data){
    const userList = cloneDeep(db);
    const { id } = data.message;
    const found = userList.find(u => u.id === id);

    if(!found){
      messages.error(ws, 'Error: Login or Password are not correct!');
      return;
    }

    messages.send(ws, 'users::one', found)
  },
  create: function(ws, data){
    const { name, login, pass } = data.message;
    if(name && login && pass){
      const userList = cloneDeep(db);
      userList.push({
        name,
        login,
        pass,
        role: USER_ROLE
      });
      return;
    }
    messages.error(ws, 'Error: Can\'t create user.');
  },
  update: function(ws, data){
    const { id } = data.message;

    if(!this.authorized[id]){
      messages.error(ws, 'Error: You are not authorized');
      return;
    }

    const userList = cloneDeep(db);
    const found = userList.findIndex(u => u.id === id);
    userList[found] = data.message;
    this.authorized[id].data = data.message;
  },

  delete: function(ws, data){
    const { id } = data.message;

    if(!this.authorized[id]){
      delete this.unauthorized[id];
      return;
    }

    delete this.authorized[id];
    const userList = cloneDeep(db);
    const found = userList.findIndex(u => u.id === id);
    delete userList[found];
  },

};


module.exports.users = users;
