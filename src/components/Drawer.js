import React, { Component } from "react";
import { Layout, Icon, Menu, Modal } from "antd";
import { Link, withRouter } from "react-router-dom";

const { Sider } = Layout;
const { confirm } = Modal;

class Drawer extends Component {
  state = {
    collapsed: true
  };
  //clear token from localStorage
  onOkay = () => {
    localStorage.clear()
    this.props.history.push('/')
    console.log('token:', localStorage.clear() )
  }

  //for pop-up logout confirmation
  showConfirm = () => {
    confirm({
      title: 'Logout',
      content: 'are you sure want to logout?',
      onOk: () => this.onOkay(),
      onCancel() {
        console.log('Cancel');
      },
    });
  }

  //sidebar span
  onCollapse = collapsed => {
    console.log(collapsed);
    this.setState({ collapsed });
  };

  render() {
    console.log("props drawer", this.props.history)
    return (
      <Sider
        collapsible
        collapsed={this.state.collapsed}
        onCollapse={this.onCollapse}>
        <div style={{ alignContent: "center" }} className="logo">
         
        </div>
        <Menu theme="dark" mode="inline" defaultSelectedKeys={["1"]}>
          <Menu.Item key="1">
            <Link to="/home">
              <Icon type="home" />
              <span>Home</span>
            </Link>
          </Menu.Item>
          <Menu.Item key="2">
            <Link to="/Distributor">
              <Icon type="shop" />
              <span>Distributor</span>
            </Link>
          </Menu.Item>
          {/* <Menu.Item key="3">
            <Link to="/Filter">
              <Icon type="filter" />
              <span>Filter</span>
            </Link>
          </Menu.Item> */}
          <Menu.Item key="4">
            <Link to="/Dealer">
              <Icon type="audit" />
              <span>Dealer</span>
            </Link>
          </Menu.Item>
          <Menu.Item key="5">
            <Link to="/Agent">
              <Icon type="book" />
              <span>Agent</span>
            </Link>
          </Menu.Item>
          <Menu.Item key="6">
            <Link to="/Driver">
              <Icon type="user" />
              <span>Driver</span>
            </Link>
          </Menu.Item>
          <Menu.Item key="7">
            <Link to="/Setting">
              <Icon type="setting" />
              <span>Setting</span>
            </Link>
          </Menu.Item>
          <Menu.Item key="8">
            <Link to="/Help">
              <Icon type="exclamation-circle" />
              <span>Help</span>
            </Link>
          </Menu.Item>
          <Menu.Item key="9" onClick={this.showConfirm}>
              <Icon type="logout" />
              <span>Logout</span>
          </Menu.Item>
        </Menu>
      </Sider>
    );
  }
}

export default withRouter(Drawer);