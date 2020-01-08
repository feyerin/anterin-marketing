import React, { Component } from "react";
import { Layout,Table,Breadcrumb,Icon,Input,Divider,Button,Tooltip } from "antd";
import axios from 'axios';
import { CSVLink } from "react-csv";

const { Column } = Table;
const { Content } = Layout;

export class FilterAgent extends Component {
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
    loading : false,
    searchValue:"",
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
    axios.get(
      "https://oapi-rv.anterin.id/api/v1/marketing/agents?search="+ this.state.searchValue +"&sort=name&includes=",
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
          }}>
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

          <Tooltip title="wait until data fully loaded">
              <CSVLink 
                  style={{float:"right"}} 
                  data={this.state.data}
                  filename={"list-agent.csv"}>
                  Export to CSV 
              </CSVLink>
          </Tooltip>   
          <Divider/>
          <Table 
            dataSource={this.state.data} 
            pagination={this.state.pagination} 
            loading={this.state.loading}
            onChange={this.handleTableChange}>
            <Column title="name" dataIndex="name"  />
            <Column title="phone" dataIndex="phone"  />
            <Column title="address" dataIndex="address"  />
            <Column title="drivers total" dataIndex="drivers_total"  />
            <Column title="token" dataIndex="token"  />
          </Table>
        </Content>
      </div>
    );
  }
}

export default FilterAgent;
