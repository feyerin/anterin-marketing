import React, { Component } from "react";
import { Table,Layout,Avatar} from "antd";
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
    data : [],
    pagination : {
    current : 1
    },
    loading : false
  };          
  
  componentDidMount() {
    this.fetch();
  }

  handleTableChange = (pagination) => {
    const pager = { ...this.state.pagination };
    console.log("PAGER", pager);
   
    pager.current = pagination.current;
    this.setState({
      ...this.state,
      pagination: pager,
    },() => this.fetch());    
  }

  fetch = () => {
    //nampilin loading
    this.setState({ 
      ...this.state,
      loading: true });
    console.log("current page", this.state.pagination.current)
    axios.get(
      URL + "api/v1/marketing/drivers?search=&sort=name&includes=&page=" + this.state.pagination.current,
      {
      //tambahin token
      headers : {
        Authorization: "Bearer "+ localStorage.getItem("token")
      }
      
    }).then(response => {
      
      console.log(response);
      const pagination = { ...this.state.pagination };
      pagination.total = 440595;
      console.log('pagination state', this.state.pagination);
      var newArray = [];
      response.data.data.forEach(item => {
        item.key = item.id;
        //item.token = item.balance.data.token;
        newArray.push(item);
      });
      this.setState({
        ...this.state,
        data: newArray,
        loading: false,
        pagination,
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
         <Table 
          dataSource={this.state.data} 
          pagination={this.state.pagination}
          loading={this.state.loading}
          onChange={this.handleTableChange}>
          <Column
            title="Avatar"
            dataIndex="photo"
            key="tags"
            render={tags => (
              <span>
                <Avatar src="this.state.data.photo" />
              </span>
            )}
          />
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