import React, { Component } from "react";
import {Badge,Layout,Avatar } from "antd";

const { Header } = Layout;


export default class Navbar extends Component {
  render() {
    return (
      <div>
        <Header style={{ background: "#fff", paddingLeft : '100%', float:"right"  }} >
            <Badge>
                <Avatar shape="circle" icon="user" />
            </Badge>
        </Header>     
      </div>
    );
  }
}
