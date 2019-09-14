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

export const socket = {
  socket: null,
  types: {},
  init: function() {
    this.socket = new WebSocket('ws://localhost:3031');
    this.socket.addEventListener('open', () => {
      console.log('Connection completed.');
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

    this.socket.send(JSON.stringify(request));
  }

};
