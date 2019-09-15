import React from 'react';
import { Container, Row, Col, Alert } from 'react-bootstrap';

import { socket } from './services/socket';
import { Login } from './login.jsx';
import { Dashboard } from './dashboard.jsx';
import { AlertComponent } from './components/alert.jsx';

export class App extends React.Component{
    constructor(props){
        super(props);

        this.state = {
            isAuth: false,
            user: null,
        };

        socket.init();

        socket.listen('users::unauth', () => {
            socket.user = null;
            socket.token = null;
        });
        socket.listen('users::auth', (data) => {
            socket.setUser(data.data);
            socket.setToken(data.token);

            this.setState({
                isAuth: true,
                user: data.data
            });
        });
    }

    render(){
        const { user, isAuth } = this.state;

        return (<Container>
                    <AlertComponent />
                    { isAuth ? <Dashboard user={user}/> : (<Login />)}
                </Container>);
    }
}
