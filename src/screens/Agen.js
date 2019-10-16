import React, { Component } from "react";
import { Layout,Table,Breadcrumb,Icon } from "antd";
import axios from 'axios';
import DetailColumn from './DetailColumn';

const { Column } = Table;
const { Content } = Layout;

export class Agen extends Component {
  //Login verivikator
  constructor(props){
    super(props);
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
      pagination: pager
    },() => this.fetch());    
  }

  fetch = () => {
    this.setState({ 
      ...this.state,
      loading: true });
    console.log("current page", this.state.pagination.current)
    axios.get(
      "https://oapi.anterin.id/api/v1/marketing/agents?page="+ this.state.pagination.current,
      {
      headers : {
        Authorization: "Bearer "+ localStorage.getItem("token")
      }
      
    }).then(response => {
      
      console.log(response);
      const pagination = { ...this.state.pagination };
      pagination.total = 451;
      console.log('pagination state', this.state.pagination);
      var newArray = [];
      response.data.data.forEach(item => {
        item.key = item.id;
        if (item.balance.code === 401){
          item.token = "user not registered"
        }else{
          item.token = item.balance.data.token
        }
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

  render() {
    return (
      <div>
        <Breadcrumb style={{padding:5}}>
            <Breadcrumb.Item>
              <Icon type="book" />
              <span>Agent</span>
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
          pagination={this.state.pagination} 
          loading={this.state.loading}
          onChange={this.handleTableChange}
          >
          <Column title="name" dataIndex="name"  />
          <Column title="phone" dataIndex="phone"  />
          <Column title="address" dataIndex="address"  />
          <Column title="drivers total" dataIndex="drivers_total"  />
          <Column title="token" dataIndex="token"  />
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

export default Agen;
