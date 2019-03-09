import 'bootstrap/dist/css/bootstrap.min.css';
import '../css/app.css';

const socket = new WebSocket("ws://localhost:3031");
socket.onopen = function() {
    message("Соединение установлено.");
};

socket.onclose = function(event) {
    if (event.wasClean) {
        message('Соединение закрыто чисто');
    } else {
        message('Обрыв соединения'); // например, "убит" процесс сервера
    }
    message('Код: ' + event.code + ' причина: ' + event.reason);
};

socket.onmessage = function(event) {
    const data = parse(event.data);
    switch(data['$type']){
        case 'deck':
            generateDeck(data.deck);
            message("Получена колода с " + data.deck.length + " картами");
            break;
        default:
            message("Получены данные " + event.data);
    }

};

socket.onerror = function(error) {
    console.log(error);
    message("Ошибка " + error.message);
};


const messagesDiv = document.getElementById('messages');
function message(str){
    const p = document.createElement('p');
    p.textContent = str;
    messagesDiv.appendChild(p);
}

function testBtns(id, json){
    const pingBtn = document.querySelector(id);
    pingBtn.addEventListener('click', (e) => {
        e.preventDefault();

        const PING_JSON = json;

        socket.send(JSON.stringify(PING_JSON));
    });
}

function generateDeck(list) {
    let deck = document.getElementById('deck');
    if(deck){
        const parent = deck.parentNode;
        parent.removeChild(deck);
    }
    deck = document.createElement('div');
    deck.id = 'deck';

    list.forEach((item, index) => {
        const card = document.createElement('div');
        card.textContent = index + ':' + item.name + ' / ' + item.suit;
        card.classList.add('card', item.suit);
        deck.appendChild(card);
    });

    document.body.appendChild(deck);
}

function parse(str){
    let data;
    try{
        data = JSON.parse(str);
    }catch(e){
        throw new Error('Error by parsing JSON: ' + str);
    }
    return data;
}

testBtns('#ping', {
    '$type': 'ping',
    'message': 'ping'
});

testBtns('#ping-error', {
    '$type2': 'ping',
    'message': 'ping'
});


const valueSelect = document.querySelector('#type');
const sendBtn = document.querySelector('#send');
sendBtn.addEventListener('click', (e) => {
    e.preventDefault();

    const DATA_JSON = {
        '$type': valueSelect.value
    };

    socket.send(JSON.stringify(DATA_JSON));
});
