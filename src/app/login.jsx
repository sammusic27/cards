import React from 'react';
import { Row, Col, Form, Button} from 'react-bootstrap';
import {socket} from './services/socket';

export class Login extends React.Component{
  constructor(props){
    super(props);

    this.state = {
    };

    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit(e){
    e.preventDefault();

    const form = e.currentTarget;
    if (form.checkValidity() === false) {
      e.preventDefault();
      e.stopPropagation();
    }

    socket.send('users::auth', {
      login: form.login.value,
      pass: form.pass.value,
      id: this.props.id
    });
  }

  render() {
    return  <Row className="justify-content-md-center">
              <Col>
                <Form name="login" onSubmit={e => this.handleSubmit(e)}>
                  <Form.Group controlId="login">
                    <Form.Label>Email address</Form.Label>
                    <Form.Control type="text" placeholder="Enter email" defaultValue="admin" />
                    <Form.Text className="text-muted">
                      We'll never share your email with anyone else.
                    </Form.Text>
                  </Form.Group>

                  <Form.Group controlId="pass">
                    <Form.Label>Password</Form.Label>
                    <Form.Control type="password" placeholder="Password" defaultValue="admin" />
                  </Form.Group>
                  <Form.Group controlId="saveMe">
                    <Form.Check type="checkbox" label="Save me" />
                  </Form.Group>
                  <Button variant="primary" type="submit" disabled={!this.props.id}>
                    Login
                  </Button>
                </Form>
              </Col>
            </Row>
  }
}
