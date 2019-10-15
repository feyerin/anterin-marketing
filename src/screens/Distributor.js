import React, { Component } from "react";
import {Table,Layout,Breadcrumb,Icon} from "antd";
import axios from "axios";
import {URL} from "../components/BaseUrl";
import DetailColumn from "../screens/Distributor/DetailColumn";

const { Content } = Layout;
const{Column} = Table;

export default class Distributor extends Component {
  //Login verivikator
  constructor(props){
    super(props);
    if(localStorage.getItem("token") == null){
      this.props.history.push('/')
    }
  }

    state = {
        data : [],
        loading : false,
      };

    componentDidMount(){
      this.setState({ loading: true });
      axios.get(URL + "/api/v1/marketing/distributors?search=&sort=-balance",
      {
        headers : {
          Authorization : 'Bearer ' + localStorage.getItem("token")
        }
      })
      .then(response => {
        console.log(response);
        console.log('try');
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
        });
      })
      .catch(function(error) {
        console.log(localStorage.getItem("token"));
        console.log(error);
      })
    }

    render(){
        return(
          <div>
            <Breadcrumb style={{padding:5}}>
            <Breadcrumb.Item>
              <Icon type="idcard" />
              <span>Distributor</span>
            </Breadcrumb.Item>
            </Breadcrumb>
            <Content
              style={{
              background: '#fff',
              padding: 24,
              margin: 0,
              minHeight: 280,
            }}
            >
            <Table 
              dataSource={this.state.data} 
              pagination={{defaultPageSize: 20}} 
              loading={this.state.loading}>
              <Column title="name" dataIndex="name"  />
              <Column title="phone" dataIndex="phone"  />
              <Column title="email" dataIndex="email"  />
              <Column title="address" dataIndex="address"  />
              {/* <Column title="token" dataIndex="token"  /> */}
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