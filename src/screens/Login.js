
import React from 'react';
import 'antd/dist/antd.css';
import '../App.css';
import { URL } from "../components/BaseUrl";
import axios from 'axios';
import { Form, Icon, Input, Button, Checkbox, message,Layout } from 'antd';
import Particles from 'react-particles-js';
import logo from "../assets/logo-anterin.png";

const { Content } = Layout;
export default class Login extends React.Component {
  //verivicator login
  constructor(props){
    super(props);
    console.log(localStorage.getItem("token"))
    if(localStorage.getItem("token") != null){
      this.props.history.push('/')
      console.log("login")
    }
  }
  
  state = {
    email: "",
    password: "",
    loading: false,
  };

  login = (_email, _password) => {
    this.setState({loading: true });
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
        this.setState({ loading: false });
        message.info("login berhasil")
        this.props.history.push('/Home')
      }
      ).catch ((error) => {
        console.log(error);
        message.error(error.response.message)
        this.setState({ 
          ...this.state, loading:false });
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
  }

  render() {
    return (
      <div>
        <Content
            style={{
              background: '#fff',
              padding: 100,
              paddingTop:20,
              paddingBottom:20,
              marginTop:'10%',
              marginBottom:'10%',
              width:500,
              marginLeft:'37%',
              position:"absolute",
            }}>
          <img style={{ width: '100%', height: '100%' }} src={logo} />
          <Form style={{ width:"100%", textAlign: 'center' }} className="login-form" >
            <Form.Item  >
              <Input
                prefix={<Icon type="mail" style={{ color: 'rgba(0,0,0,.25)' }} />}
                placeholder="email"
                onChange={(e) => this.getEmailValue(e)}/>
            </Form.Item>
            <Form.Item>
              <Input
                prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
                type="password"
                placeholder="Password"
                onChange={(e) => this.getPasswordValue(e)}/>
            </Form.Item>
            <Form.Item >
              <Checkbox style={{ float: 'left' }}>Remember me</Checkbox>
              <a className="login-form-forgot" style={{ float: 'right' }}>
                Forgot password
              </a>
              <br/>
                <Button
                  type="primary"
                  className="login-form-button"
                  style={{ width: '100%' }}
                  onClick={() => this.onClicked()}
                  loading={this.state.loading}>
                  Log in
                </Button>          
              <br/>
              Or <a>register now!</a>
            </Form.Item>
          </Form>
        </Content>
        <Particles
          params={{
            "particles": {
                "number": {
                    "value": 150
                },
                "size": {
                    "value": 5
                }
            },
            "interactivity": {
                "events": {
                    "onhover": {
                        "enable": true,
                        "mode": "repulse"
                    }
                }
            }
        }}></Particles>
    </div>
    );
  }
}

