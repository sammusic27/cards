import isFunction from 'lodash/isFunction';
import isPlainObject from 'lodash/isPlainObject';

function parse(str){
  let data;
  try{
    data = JSON.parse(str);
  }catch(e){
    throw new Error('Error by parsing JSON: ' + str);
  }
  return data;
}

function setCookie(name, value, days) {
  let expires = "";
  if (days) {
    const date = new Date();
    date.setTime(date.getTime() + (days*24*60*60*1000));
    expires = "; expires=" + date.toUTCString();
  }
  document.cookie = name + "=" + (value || "")  + expires + "; path=/";
}
function getCookie(name) {
  const nameEQ = name + "=";
  const ca = document.cookie.split(';');
  for(let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) === ' ') c = c.substring(1, c.length);
    if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
  }
  return null;
}
function eraseCookie(name) {
  document.cookie = name+'=; Max-Age=-99999999;';
}

export const socket = {
  socket: null,
  user: null,
  token: null,
  types: {},
  setToken(token){
    this.token = token;
    setCookie('token', token, 1);
  },
  setUser(user){
    this.user = user;
  },

  getToken(){
    this.token = getCookie('token');
    return this.token;
  },

  init: function() {
    this.socket = new WebSocket('ws://localhost:3031');
    this.socket.addEventListener('open', () => {
      console.log('Connection completed.');
      this.getToken();
      if(this.token){
        this.send('users::check', {});
      }
    });

    this.socket.addEventListener('close', (event) => {
      if (event.wasClean) {
        console.log('Close clean connection');
      } else {
        console.log('Close connection.'); // например, "убит" процесс сервера
      }
      console.log('Code: ' + event.code + ' Message: ' + event.reason);
    });

    this.socket.addEventListener('message', (event) => {
      const data = parse(event.data);

      console.log('socket', data);
      const cbList = this.types[data['$type']];
      if(cbList){
        cbList.forEach(cb => cb(data.message));
      }
    });

    this.socket.addEventListener('error', (error) => {
      console.log('error', error);
    });
  },

  listen: function (type, cb) {
    if(!type){
      console.log('No type for listener.');
      return;
    }

    if(!isFunction(cb)){
      console.log('No callback for listener.');
      return;
    }

    if(this.types[type]){
      this.types[type].push(cb);
    } else {
      this.types[type] = [cb];
    }
  },

  send: function(type, data) {
    if(!type){
      console.log('Error send request: No type for listener.');
      return;
    }

    if(!isPlainObject(data)){
      console.log('Error send request: Data is not an object.');
      return;
    }

    const request = {
      '$type': type,
      'message': data,
    };

    data.userId = this.user ? this.user.id : null;
    data.token = this.token ? this.token : null;

    this.socket.send(JSON.stringify(request));
  }

};
