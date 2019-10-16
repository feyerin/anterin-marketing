import React, { Component } from "react";
import { Layout,Table,Breadcrumb,Icon } from "antd";
import axios from 'axios';
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
    data : [],
    pagination : {
      current : 1
    },
    loading : false
  };

  componentDidMount() {
    //ini ceritanya langsung ngambil data pas masuk App
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
    //nampilin loading
    this.setState({ 
      ...this.state,
      loading: true });
    console.log("current page", this.state.pagination.current)
    axios.get(
      "https://oapi.anterin.id/api/v1/marketing/dealers?page="+ this.state.pagination.current,
      {
      //tambahin token
      headers : {
        Authorization: "Bearer "+ localStorage.getItem("token")
      }
      
    }).then(response => {
      
      console.log(response);
      const pagination = { ...this.state.pagination };
      pagination.total = 500;
      console.log('pagination state', this.state.pagination);
      var newArray = [];
      response.data.data.forEach(item => {
        item.key = item.id;
        //item.token = item.balance.data.token;
        console.log("get token",item.balance.data)
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
              <Icon type="audit" />
              <span>Dealer</span>
            </Breadcrumb.Item>
        </Breadcrumb>

        <Content
          style={{
            background: '#fff',
            padding: 24,
            margin: 0,
            minHeight: 1000,
          }}
        >
        <Table 
          dataSource={this.state.data}
          pagination={this.state.pagination} 
          loading={this.state.loading}
          onChange={this.handleTableChange}>
          <Column title="name" dataIndex="name"  />
          <Column title="phone" dataIndex="phone"  />
          <Column title="email" dataIndex="email"  />
          <Column title="address" dataIndex="address"  />
          <Column title="agents total" dataIndex="agents_total"  />
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
