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
            uniqueId: null,
            isAuth: false,
            user: null,
        };

        socket.init();
        socket.listen('users::unauth', (userId) => {
            this.setState({
                uniqueId: userId
            });
        });
        socket.listen('users::auth', (data) => {
            this.setState({
                isAuth: true,
                user: data
            });
        });
    }

    render(){
        const { user, uniqueId, isAuth } = this.state;

        return (<Container>
                    <AlertComponent />
                    { isAuth ? <Dashboard user={user}/> : (<Login id={uniqueId} />)}
                </Container>);
    }
}
