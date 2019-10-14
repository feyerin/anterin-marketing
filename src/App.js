import React, { Component } from "react";
import { Layout } from "antd";
import { withRouter, Route, Switch } from "react-router-dom";
import "./App.css";
import Home from "./screens/Home";
import Drawer from "./components/Drawer";
import Navbar from "./components/Navbar";
import Distributor from "./screens/Distributor";
import Driver from "./screens/Driver";
import Dealer from "./screens/Dealer";
import Agen from "./screens/Agen";
import Login from "./screens/Login";
import Logout from "./screens/Logout";
import dashboard from "./screens/dashboard";
import AgenDetail from "./screens/AgenDetail";
import DealerDetail from "./screens/Dealer/DealerDetail";
import DistributorDetail from "./screens/Distributor/DistributorDetail";

const { Content } = Layout;

class App extends Component {
  render() {
  return (
    <Switch>
        <Route exact path="/" component={Login}/>
        <Route path="/dashboard" component={dashboard}/>
       <Layout style={{ minHeight: "100vh" }}>
      <Drawer customProps={this.props.history}/>
      <Layout>
      
      <Navbar/>
          <Content style={{ margin: '0 16px' }}>
            <Route path="/Home" component={Home}/>
            <Route path="/Distributor" component={Distributor}/>
            <Route path="/DistributorDetail" component={DistributorDetail}/>
            <Route path="/Driver" component={Driver}/>
            <Route path="/Dealer" component={Dealer}/>
            <Route path="/DealerDetail" component={DealerDetail}/>
            <Route path="/Agen" component={Agen}/>
            <Route path="/AgenDetail" component={AgenDetail}/>
            <Route path="/Logout" component={Logout}/>

          </Content>
      </Layout>
      </Layout>
      <Navbar/>
          
      </Switch> 
  );
}
}

export default withRouter(App);
