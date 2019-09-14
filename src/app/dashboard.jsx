import React from 'react';
import { Table, Button } from 'react-bootstrap';
import { socket } from './services/socket';
import cloneDeep from 'lodash/cloneDeep';

export class Dashboard extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      rooms: []
    };

    socket.listen('rooms::list', (rooms) => {
      console.log('rooms', rooms);
      this.setState({
        rooms
      });
    });

    this.getRooms();
    this.getRooms = this.getRooms.bind(this);
    this.connect = this.connect.bind(this);
  }

  getRooms(){
    socket.send('rooms::list', {});
  }

  connect(e, room){
    e.preventDefault();
    socket.send('rooms::connect', {
      id: room.id,
      user: this.props.user
    });
  }

  disconnect(e, room){
    e.preventDefault();
    socket.send('rooms::disconnect', {
      id: room.id,
      user: this.props.user
    });
  }

  renderActions(room){
    const user = this.props.user;
    const actions = [];

    if(!room.users[user.id]){
      actions.push(<Button onClick={(e) => this.connect(e, room)}>Connect</Button>);
    } else {
      actions.push(<Button variant="success" onClick={(e) => this.disconnect(e, room)}>Disconnect</Button>);
    }

    return actions;
  }

  renderRooms(){
    const output = [];
    const rooms = cloneDeep(this.state.rooms);
    for(const i in rooms){
      output.push(rooms[i]);
    }

    return output.map(room => {
      return (
        <tr key={room.id}>
          <td>{room.name}</td>
          <td>{Object.keys(room.users).join()}</td>
          <td>{this.renderActions(room)}</td>
        </tr>
      );
    });
  }

  render(){
    return (<div>
              <h1>Dashboard</h1>

              <div>
                <Button onClick={this.getRooms}>Refresh Rooms</Button>
              </div>

              <Table striped bordered>
                <thead>
                  <tr>
                    <td>Rooms</td>
                    <td>Availability</td>
                    <td>Actions</td>
                  </tr>
                </thead>
                <tbody>
                {this.renderRooms()}
                </tbody>
              </Table>
            </div>);
  }
}
