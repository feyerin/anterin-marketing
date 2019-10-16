import React, { Component } from "react";
import { Layout } from "antd";
import { Route } from "react-router-dom";
import "../App.css";
import Home from "./Home";
import Drawer from "../components/Drawer";
import Navbar from "../components/Navbar";
import Distributor from "../screens/Distributor";
import Driver from "./Driver";
import Dealer from "./Dealer";
import Agen from "./Agen";
import Logout from "./Logout";

const { Content } = Layout;

export default class dashboard extends Component {
  constructor(props) {
    super(props)
    console.log(this)
  }
  render() {
    return (
      <Layout style={{ minHeight: "100vh" }}>
        <Drawer customProps={this.props.history} />
        <Layout>
          <Navbar />
          <Content style={{ margin: '0 16px' }}>
            <Route path="/Home" component={Home} />
            <Route path="/Distributor" component={Distributor} />
            <Route path="/Driver" component={Driver} />
            <Route path="/Dealer" component={Dealer} />
            <Route path="/Agen" component={Agen} />
            <Route path="/Logout" component={Logout} />
          </Content>
        </Layout>
      </Layout>
    );
  }
}