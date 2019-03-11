const { messages } = require('../message');

const ADMIN_ROLE = 'admin';
const USER_ROLE = 'user';

const db = [
  {
    name: 'Admin',
    role: ADMIN_ROLE,
    login: 'admin',
    pass: 'admin',
  },
  {
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
  initUser: function(ws){
    // TODO: update unique model of unauthorized user
    const id = Math.random();
    if(this.unauthorized[id]){
      messages.error(ws, 'Error: this user already exists as unauthorized');
      return;
    }

    this.unauthorized[id] = {
      ws
    };
    return id;
  },
  authUser: function(ws, data){
    const { id, login, pass } = data.message;
    const found = db.find(u => u.login === login && u.pass === pass);

    if(found && this.unauthorized[id]){
      this.authorized[id] = this.unauthorized[id];
      this.authorized[id].data = found;
      delete this.unauthorized[id];
      messages.send(ws, 'auth', found)
    } else {
      messages.error(ws, 'Error: Login or Password are not correct!');
    }

    return !!found;
  },
  createUser: function(ws, data){
    if(data.name && data.login && data.pass){
      db.push({
        ...data,
        role: USER_ROLE
      });
      return true;
    }
    messages.error(ws, 'Error: Can\'t create user.');
    return false;
  },
  editUser: function(ws, data){
    const { id } = data;
    if(!this.authorized[id]){
      messages.error(ws, 'Error: You are not authorized');
      return false;
    }

    const login = this.authorized[id].data.login;
    const found = db.findIndex(u => u.login === login);
    db[found] = data;
    this.authorized[id].data = data;
  },
  removeUser: function(ws, data){
    const { id } = data;
    if(!this.authorized[id]){
      delete this.unauthorized[id];
      return false;
    }

    const login = this.authorized[id].data.login;
    const found = db.findIndex(u => u.login === login);
    delete db[found];
  },



};


module.exports.users = users;
