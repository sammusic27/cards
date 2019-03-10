const message = {
  send: function(ws, type, message){
    if(!ws){
      console.log('Error:', 'Can\'t send any of message. You forgot to send ws in stance.');
    }

    if(!type){
      console.log('Error:', 'Empty $type');
    }

    if(!message){
      console.log('Error:', 'Empty message');
    }

    const data = JSON.stringify({'$type': type, 'message': message});
    ws.send(data);
  },

  error: function(ws, message){
    this.send(ws, 'error', message);
  },
};

function parseData(request){
  let data;
  try{
    data = JSON.parse(request);
    if(!data['$type']){
      data = null;
    }
  }catch(e){
    console.log('error by ' + request, e);
  }

  return data;
}

module.exports.parseData = parseData;
module.exports.messages = message;
