import React, { Component } from "react";
import { Layout,Table, Breadcrumb, Icon } from "antd";
import axios from 'axios';

const { Column } = Table;
const { Content } = Layout;

export class Home extends Component {
  //verivikator login
  constructor(props){
    super(props);
    if(localStorage.getItem("token") == null){
      this.props.history.push('/')
      console.log("login")
    }
  }
  state = {
    data : [],
    pagination : {
      current : 1
    },
    loading : false
  };

  handleTableChange = (pagination) => {
    const pager = { ...this.state.pagination };
    console.log("PAGER", pager);
    pager.current = pagination.current;
    console.log("current ", pager.current)
    this.setState({
      ...this.state,
      pagination: pager
    },() => this.fetch());    
  }

  componentDidMount() {
    this.fetch();
  }

  fetch = () => {
    this.setState({ 
      ...this.state,
      loading: true });
    console.log("ONREQUEST", this.state)
    axios.get(
      "https://oapi.anterin.id/api/v1/marketing/spread?page="+ this.state.pagination.current,
      {
      headers : {
        Authorization: "Bearer "+ localStorage.getItem("token")
      }
    }).then(response => {
      console.log("ONFINISHREQUEST:", this.state.pagination.current)
      console.log(response);
      const pagination = { ...this.state.pagination };
      pagination.total = 30;
      var newArray = [];
      response.data.data.forEach(item => {
        item.key = item.province_id;
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
            <Icon type="home" />
            <span>Home</span>
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
          onChange={this.handleTableChange}
          dataSource={this.state.data}
          pagination={this.state.pagination} 
          loading={this.state.loading}
          >   
          <Column title="name" dataIndex="name"  />
          <Column title="distributors" dataIndex="distributors"  />
          <Column title="dealers total" dataIndex="dealers_total"  />
          <Column title="agent total" dataIndex="agents_total"  />
          <Column title="drivers total" dataIndex="drivers_total" />
          
          </Table>
        </Content>

      </div>
    );
        }
      }

export default Home;
