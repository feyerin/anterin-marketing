import React, { Component } from "react";
import { Layout,Table } from "antd";
import {URL} from "../components/BaseUrl";
import axios from 'axios';


const { Column } = Table;
const { Content } = Layout;

export class Home extends Component {
  //verivikator login
  constructor(props){
    super(props);
    console.log(localStorage.getItem("token"))
    if(localStorage.getItem("token") == null){
      this.props.history.push('/')
      console.log("login")
    }
  }

  state = {
    data : []
  };

  componentDidMount(){
    axios.get(URL + "api/v1/marketing/spread",
    {
      headers : {
        Authorization : 'Bearer ' + localStorage.getItem("token")
      }
    })
    .then(response => {
      console.log(response);
      console.log("Agen");
      var newArray = [];
      response.data.data.forEach(item => {
        item.key = item.province_id;
        newArray.push(item);
      });
      this.setState({
        ...this.state,
        data: newArray
      });
    })
    .catch(function(error) {
      console.log(error);
    })
  }

  render() {
    return (
      
      <div>
        <Content
          style={{
            background: '#fff',
            padding: 24,
            margin: 0,
            marginTop: 16,
            minHeight: 280,
          }}
        >
          {/* <Table
          columns={this.column} dataSource={this.state.data} pagination={{defaultPageSize: 20}}
        /> */}
        <Table dataSource={this.state.data}>
          <Column title="name" dataIndex="name"  />
          <Column title="distributors" dataIndex="distributors"  />
          <Column title="address" dataIndex="dealers_total"  />
          <Column title="token" dataIndex="agents_total"  />
          <Column title="drivers total" dataIndex="drivers_total" />
          <Column title="drivers total" dataIndex="drivers_total" />
          </Table>
        </Content>

      </div>
    );
  }
}

export default Home;
