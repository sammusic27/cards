const { messages } = require('../message');
const { encrypt, decrypt } = require('../crypt');
const cloneDeep = require('lodash/cloneDeep');
const uniqueId = require('lodash/uniqueId');

const ADMIN_ROLE = 'admin';
const USER_ROLE = 'user';

function getId(){
  return uniqueId('user');
}

function createUser(name, role, login, pass){
  const id = getId();

  return {
    id,
    name,
    role,
    login,
    token: 'token' + id,
    tokenDate: +new Date(),
    pass: encrypt(pass),
  };
}

const user1 = createUser('Admin', ADMIN_ROLE, 'admin', 'admin');
const user2 = createUser('Test', USER_ROLE, 'test', 'test');

const db = [
  {
    ...user1
  },
  {
    ...user2
  }
];

const SESSION_TIME_EXPIRED = 1000 * 60 * 3; // 3 minutes

const users = {
  authorized: {},

  addToAuthorized(ws, user){
    this.authorized[user.id] = {
      ws,
      data: user,
      token: user.token,
      tokenDate: +new Date()
    };
  },

  authUser: function(ws, data){
    const { login, pass } = data.message;
    const userList = db;

    const found = userList.find(u => u.login === login);
    if(decrypt(found.pass) !== pass){
      const message = 'Error: Login or Password are not correct!';
      messages.error(ws, message);
      return;
    }

    if(found){
      found.token = 'token' + found.id;
      found.tokenDate = +new Date();
      this.addToAuthorized(ws, found);
      messages.send(ws, 'users::auth', this.authorized[found.id]);
    } else {
      const message = 'Error: Login or Password are not correct!';
      messages.error(ws, message);
    }
  },

  checkAuth(ws, data){
    const token = data.message.token;

    const found = db.find(i => i.token === token);
    if(!found){
      messages.error(ws, 'You session is expired! Please Login again.');
      return false;
    }

    const userId = found.id;
    const now = +new Date();

    if(now - found.tokenDate > SESSION_TIME_EXPIRED){
      messages.send(ws, 'users::unauth', userId);
      found.token = null;
      return false;
    }

    found.tokenDate = +new Date();
    this.addToAuthorized(ws, found);
    messages.send(ws, 'users::auth', this.authorized[userId]);
    return true;
  },

  getUsers: function(ws, data){
    // TODO: make some sort or filters using data
    messages.send(ws, 'users::list', this.authorized);
  },
  getUser: function(ws, data){
    const userList = db;
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
      const userList = db;
      userList.push(createUser(name, USER_ROLE, login, pass));
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

    const userList = db;
    const found = userList.findIndex(u => u.id === id);
    userList[found] = data.message;
    this.authorized[id].data = data.message;
  },

  delete: function(ws, data){
    const { id } = data.message;

    if(!this.authorized[id]){
      return;
    }

    delete this.authorized[id];
    const userList = db;
    const found = userList.findIndex(u => u.id === id);
    delete userList[found];
  },

};

module.exports.users = users;
