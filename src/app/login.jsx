import React from 'react';
import { Row, Col, Form, Button} from 'react-bootstrap';

export class Login extends React.Component{
  constructor(props){
    super(props);

    this.state = {
      form: {
        login: '',
        pass: ''
      }
    };

    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit(e){
    e.preventDefault();

    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
    }

    this.props.send('user::auth', {
      login: 'admin',
      pass: 'admin',
    });
    console.log(new FormData(form).values(), form.login.value);
  }

  render() {
    const { form } = this.state;
    return  <Row className="justify-content-md-center">
              <Col>
                <Form name="login" onSubmit={e => this.handleSubmit(e)}>
                  <Form.Group controlId="login">
                    <Form.Label>Email address</Form.Label>
                    <Form.Control type="email" placeholder="Enter email" />
                    <Form.Text className="text-muted">
                      We'll never share your email with anyone else.
                    </Form.Text>
                  </Form.Group>

                  <Form.Group controlId="pass">
                    <Form.Label>Password</Form.Label>
                    <Form.Control type="password" placeholder="Password" />
                  </Form.Group>
                  <Form.Group controlId="saveMe">
                    <Form.Check type="checkbox" label="Save me" />
                  </Form.Group>
                  <Button variant="primary" type="submit">
                    Login
                  </Button>
                </Form>
              </Col>
            </Row>
  }
}
