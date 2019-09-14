import React from 'react';
import { socket } from '../services/socket';
import {Alert} from 'react-bootstrap';

export class AlertComponent extends React.Component{
  constructor(props){
    super(props);

    this.state = {
      error: null
    };

    socket.listen('error', (error) => {
      this.setState({
        error
      });
    });
  }

  render(){
    const { error } = this.state;
    return error ? (<Alert variant="danger">{error}</Alert>) : null;
  }
}
