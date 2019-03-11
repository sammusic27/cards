import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { Login } from './login.jsx';

function parse(str){
    let data;
    try{
        data = JSON.parse(str);
    }catch(e){
        throw new Error('Error by parsing JSON: ' + str);
    }
    return data;
}

export class App extends React.Component{
    constructor(props){
        super(props);

        const socket = this.socket();

        this.state = {
            socket,
            isAuth: false,
            userId: 0,
            data: {}
        };

        this.send = this.send.bind(this);
    }

    socket(){
        const socket = new WebSocket("ws://localhost:3031");
        socket.onopen = () => {
            console.log("Соединение установлено.");
        };

        socket.onclose = (event) => {
            if (event.wasClean) {
                console.log('Соединение закрыто чисто');
            } else {
                console.log('Обрыв соединения'); // например, "убит" процесс сервера
            }
            console.log('Код: ' + event.code + ' причина: ' + event.reason);
        };

        socket.onmessage = (event) => {
            const data = parse(event.data);

            let userId = this.state.userId;
            if(data['$type'] === 'unauth' && this.state.userId === 0){
                userId = data['message'];
            }

            if(data['$type'] === 'auth'){
                this.setState({
                    isAuth: true,
                    user: data.message
                });
            }

            this.setState({
                data,
                userId
            });
        };

        socket.onerror = (error) => {
            console.log(error);
        };

        return socket;
    }

    send(type, data){
        const request = {
            '$type': type,
            'message': {
                ...data,
                'id': this.state.userId
            },
        };

        this.state.socket.send(JSON.stringify(request));
    }




    render(){
        const { data, userId, isAuth } = this.state;



        return (<Container>
                    <Row>
                        <Col>{JSON.stringify(data)}</Col>
                        <Col>{userId}</Col>
                    </Row>
                    { isAuth > 0 ? null : (<Login send={this.send} data={data} />)}
                </Container>);
    }
}
