import React, { Component } from "react";
import { Table,Layout} from "antd";
import axios from "axios";
import {URL} from "../components/BaseUrl";

const { Content } = Layout;
const { Column } = Table;
export default class Driver extends Component {
  //Login verivikator
  constructor(props){
    super(props);
    console.log(localStorage.getItem("token"))
    if(localStorage.getItem("token") == null){
      this.props.history.push('/')
    }
  }


    state = {
        data : []
      };

    componentDidMount(){
      axios.get(URL + "api/v1/marketing/drivers?search=&sort=name&includes=&limit=200",
      {
        headers : {
          Authorization : 'Bearer ' + localStorage.getItem("token")
        }
      })
      .then(response => {
        console.log(response);
        console.log("Driver");
        var newArray = [];
        response.data.data.forEach(item => {
          item.key = item.id;
          //item.token = item.balance.data.token;
          //console.log("item :", item.balance.data.token)
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
    
    render(){
        return(
        <Content
            style={{
            background: '#fff',
            padding: 24,
            margin: 0,
            marginTop: 16,
            minHeight: 280,
          }}
        >
         <Table dataSource={this.state.data} pagination={{defaultPageSize:30}}>
          <Column title="name" dataIndex="name"  />
          <Column title="phone" dataIndex="phone"  />
          <Column title="gender" dataIndex="gender"  />
          <Column title="address" dataIndex="address"  />
          {/* <Column title="token" dataIndex="token"  /> */}
          </Table>
        </Content>
        );

        
    }
}