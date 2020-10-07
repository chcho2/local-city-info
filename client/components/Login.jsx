import React, { useState, useEffect } from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Tabs from 'react-bootstrap/Tabs';
import Tab from 'react-bootstrap/Tab';
import { Link, useHistory } from 'react-router-dom';

function Login(props) {
  let history = useHistory();

  function redirecting() {
    history.push('/');
  }

  const login = (user) => {

    console.log('userProfile', user.getBasicProfile());
    const profile = user.getBasicProfile()
    // const firstName = profile.getGivenName();
    // console.log('firstName: ', firstName)
    // // GET LAST NAME
    // const lastName = profile.getFamilyName();
    // console.log('lastName: ', lastName)
    // // GET IMAGE URL
    // const imageUrl = profile.getImageUrl();
    // console.log('imageURL: ', imageUrl)
    // // GET EMAIL
    // const email = profile.getEmail();
    // console.log('email: ', email)
    const token = user.getAuthResponse().id_token;
    console.log('token', token)
    fetch('http://localhost:3000/signin', {
      method: 'POST',
      body: JSON.stringify({
        token: token
      }),
      headers: {
        'Content-Type': 'application/json',
      }
    })
      .then((data) => data.json())
      .then((response) => {
        if (response.authorized) {
          alert('Log in Successul!')
          redirecting();
        } else {
          alert('Please try again!')
        }
      })
      .catch((error) => {
        console.error('There is an error in fetching OAuth data', error)
      })
  }



  useEffect(() => {
    gapi.signin2.render('g-signin2', {
      'width': 300,
      'height': 50,
      'longtitle': true,
      'theme': 'dark',
      'onsuccess': login
    })
  })

  return (
    <div className="container signup-login-container">
      <h1>Welcome!</h1>
      <Tabs defaultActiveKey="signup" id="signup-login-tab">
        <Tab eventKey="signup" title="Sign Up">
          <Form className="signup-login-form">
            <Form.Group controlId="formFirstName">
              <Form.Label>First Name</Form.Label>
              <Form.Control type="text" placeholder="Enter First Name" />
            </Form.Group>

            <Form.Group controlId="formLastName">
              <Form.Label>Last Name</Form.Label>
              <Form.Control type="text" placeholder="Enter Last Name" />
            </Form.Group>

            <Form.Group controlId="formEmail">
              <Form.Label>Email address</Form.Label>
              <Form.Control type="email" placeholder="Enter email" />
              <Form.Text className="text-muted">
                We'll never share your email with anyone else.
              </Form.Text>
            </Form.Group>

            <Form.Group controlId="formPassword">
              <Form.Label>Password</Form.Label>
              <Form.Control type="password" placeholder="Password" />
            </Form.Group>
            <Button variant="primary" type="submit">
              Sign Up!
            </Button>
          </Form>
        </Tab>
        <Tab eventKey="login" title="Log In">
          <Form className="signup-login-form">
            <Form.Group controlId="formEmail">
              <Form.Label>Email address</Form.Label>
              <Form.Control type="email" placeholder="Enter email" />
            </Form.Group>

            <Form.Group controlId="formPassword">
              <Form.Label>Password</Form.Label>
              <Form.Control type="password" placeholder="Password" />
            </Form.Group>
            <Button variant="primary" type="submit">
              Log In
            </Button>

          </Form>
        </Tab>
      </Tabs>
      <div id="g-signin2" ></div>
    </div>
  );
}

export default Login;
