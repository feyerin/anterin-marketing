import React, { Component } from "react";
import { Layout,Table,Breadcrumb,Icon,Input,Divider,Button } from "antd";
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
    loading : false,
    searchValue:"",
  };

  componentDidMount() {
    this.fetch();
  }

  handleTableChange = (pagination) => {
    const pager = { ...this.state.pagination };
    pager.current = pagination.current;
    this.setState({
      ...this.state,
      pagination: pager
    },() => this.fetch());    
  }

  getSearchValue = (e) => {
    this.setState({
      ...this.state,
      searchValue: e.target.value
    })
    console.log(e.target.value)
  }

  onClicked = () => {
    console.log(this)
    this.search(this.state.searchValue)
  }

  fetch = () => {
    this.setState({ 
      ...this.state,
      loading: true });
    console.log("current page", this.state.pagination.current)
    axios.get(
      "https://oapi.anterin.id/api/v1/marketing/dealers?search=&page="+ this.state.pagination.current,
      {
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

  search = () => {
    this.setState({ 
      ...this.state,
      loading: true });
    console.log("current page", this.state.pagination.current)
    axios.get(
      "https://oapi.anterin.id/api/v1/marketing/dealers?search="+ this.state.searchValue +"&sort=name&includes=",
      {
      headers : {
        Authorization: "Bearer "+ localStorage.getItem("token")
      }
      
    }).then(response => {
      
      console.log(response);
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
            minHeight: 280,
          }}
        >
        <Input style={{width:200}}
          prefix={<Icon type="search" style={{ color: 'rgba(0,0,0,.25)' }} />}
          placeholder="search text value"
          onChange={(e) => this.getSearchValue(e)}
        />
        <Divider type="vertical"/>
        <Button
          type="primary"
          shape="circle"
          icon="search"
          onClick={() => this.onClicked()}
          loading={this.state.loading}
        ></Button>
          <Divider/>
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
          <Column title="token" dataIndex="token"/>
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
