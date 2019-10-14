import React, { Component } from "react";
import { Layout,Table } from "antd";
import axios from 'axios';
import {URL} from "../components/BaseUrl";
import DetailColumn from "../screens/Dealer/DetailColumn";

const { Column } = Table;
const { Content } = Layout;

export class Dealer extends Component {
  //Login verivikator
  constructor(props){
    super(props);
    console.log(this)
    if(localStorage.getItem("token") == null){
      this.props.history.push('/')
    }
  }


  state = {
    data : []
  };
  column = [
    {
      title: "name",
      dataIndex: "name"
    },
    {
      title: "phone",
      dataIndex: "phone"
    },
    {
      title: "email",
      dataIndex: "email"
    },
    {
      title: "address",
      dataIndex: "address"
    },
  ]
  componentDidMount(){
    axios.get(URL + "/api/v1/marketing/dealers?search=&sort=name&includes=",
    {
      headers : {
        Authorization : 'Bearer ' + localStorage.getItem("token")
      }
    })
    .then(response => {
      console.log(response);
      var newArray = [];
      response.data.data.forEach(item => {
        item.key = item.id;
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
            minHeight: 1000,
          }}
        >
          {/* <Table
          columns={this.column} dataSource={this.state.data} pagination={{defaultPageSize: 20}}
        /> */}
        <Table dataSource={this.state.data}>
          <Column title="name" dataIndex="name"  />
          <Column title="phone" dataIndex="phone"  />
          <Column title="email" dataIndex="email"  />
          <Column title="address" dataIndex="address"  />
          <Column title="detail" dataIndex="detail" 
        render={
          (unused1,obj,unused2) => <DetailColumn history={this.props.history} data={obj}/>
        }
        > 
        </Column>
        </Table>,
        </Content>
        
      </div>
    );
  }
}

export default Dealer;
