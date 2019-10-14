
import React from 'react';
import 'antd/dist/antd.css';
import '../App.css';
import { URL } from '../components/BaseUrl';
import axios from 'axios';
import { Form, Icon, Input, Button, Checkbox, message } from 'antd';



export default class Login extends React.Component {
  //verivicator login
  constructor(props){
    super(props);
    console.log(localStorage.getItem("token"))
    if(localStorage.getItem("token") != null){
      this.props.history.push('/dashboard')
      console.log("login")
    }
  }
  
  state = {
    email: "",
    password: ""
  };

  login = (_email, _password) => {
  const LOGIN_ENDPOINT = `${URL}api/v1/marketing/login`;
  axios.post(LOGIN_ENDPOINT, {
    email: _email,
    password: _password
  })
    .then((response) => {
      let jwt = response.data.token;
      let expire_at = response.data.expired;

      console.log(response)
      localStorage.setItem("token", jwt);
      localStorage.setItem("expired", expire_at);
      message.info("login berhasil")
      this.props.history.push('/dashboard')
    }
    )
    .catch(function (error) {
      console.log(error);
      message.error("login gagal!!!")
    });
  }

  getEmailValue = (e) => {
    this.setState({
      ...this.state,
      email: e.target.value
    })
    console.log(e.target.value)
  }
  getPasswordValue = (e) => {
    console.log(e.target.value)
    this.setState({
      ...this.state,
      password: e.target.value
    })
  }

  onClicked = () => {
    console.log(this)
    this.login(this.state.email, this.state.password)
    //this.login("anterin.id@gmail.com", "alwaysSUKSES!#!#!#")
  }

  render() {
    return (
      <Form style={{ margin: 100, marginLeft: '37%', textAlign: 'center' }} className="login-form" >
        <Form.Item  >
          <Input
            prefix={<Icon type="mail" style={{ color: 'rgba(0,0,0,.25)' }} />}
            placeholder="email"
            onChange={(e) => this.getEmailValue(e)}
          //getFieldsValue={this.data.email}
          />
        </Form.Item>
        <Form.Item>
          <Input
            prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
            type="password"
            placeholder="Password"
            onChange={(e) => this.getPasswordValue(e)}
          //getFieldsValue={this.data.password}
          />
        </Form.Item>
        <Form.Item >
          <Checkbox style={{ float: 'left' }}>Remember me</Checkbox>
          <a className="login-form-forgot" href="" style={{ float: 'right' }}>
            Forgot password
          </a>
          <br></br>
          
            <Button
              type="primary"
              className="login-form-button"
              style={{ width: '100%' }}
              onClick={() => this.onClicked()}
            >
              Log in
          </Button>
          
          <br></br>
          Or <a href="">register now!</a>
        </Form.Item>
      </Form>
    );
  }
}

