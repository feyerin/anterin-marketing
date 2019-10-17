import React, { Component } from 'react';
import { Table,Layout,Tabs,Breadcrumb,Icon,Descriptions } from 'antd';
import axios from 'axios';


const { Column } = Table;
const { Content } = Layout;
const { TabPane } = Tabs;

export default class AgenDetail extends Component {
    constructor(props) {
        super(props)
        console.log("TES PASSING DATA", props.location.state)
        if (props.location.state.balance.code === 401){
          this.container = "user not registered"
       }else{
           this.container = props.location.state.balance.data.token
       }
       console.log("TES PASSING DATA", this.container)
    }

    state = {
        data : [],
        drivers:[],
        pagination : {
            current : 1
          },
        loading: false,
      };
      
      handleTableChange = (pagination) => {
        const pager = { ...this.state.pagination };
        console.log("PAGER", pager);
        pager.current = pagination.current;
        this.setState({
          ...this.state,
          pagination: pager
        },() => this.fetch());    
      }

      handleTableDriversChange = (pagination) => {
        const pager = { ...this.state.pagination };
        console.log("PAGER", pager);
        pager.current = pagination.current;
        this.setState({
          ...this.state,
          pagination: pager
        },() => this.onSwichDrivers());    
      }

      componentDidMount(){
        this.fetch();
      }

      fetch = () => {
        this.setState({ 
          ...this.state,
          loading: true });
        console.log("current page dealer", this.state.pagination.current)
        axios.get(
          "https://oapi.anterin.id/api/v1/marketing/dealers/" + this.props.location.state.id + '/agents?page='
          + this.state.pagination.current,
          {
          headers : {
            Authorization: "Bearer "+ localStorage.getItem("token")
          }
        }).then(response => {
          console.log(response);
          const pagination = { ...this.state.pagination };
          pagination.total = 500;
          var newArray = [];
          response.data.data.forEach(item => {
            item.key = item.id;
            if (item.balance.code === 401){
              item.token = "user not registered"
            }else{
              item.token = item.balance.data.token
            }
            console.log("get token", item.balance.data.token)
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

    onSwichDrivers = () => {
      this.setState({ 
        ...this.state,
        loading: true });
        console.log("current page drivers", this.state.pagination.current)
        const axios = require('axios');
        axios.get("https://oapi.anterin.id/api/v1/marketing/dealers/" + this.props.location.state.id + '/drivers?page='
        + this.state.pagination.current,
            {
                headers: {
                    Authorization: 'Bearer ' + localStorage.getItem("token")
                }
            }).then(response => {
                console.log('NESTEDCALLAPI ', response.data.data);
                console.log("current page drivers", this.state.pagination.current)
                const pagination = { ...this.state.pagination };
                pagination.total = 1000;
                var newArray = [];
                response.data.data.forEach(item => {
                    item.key = item.id;
                    if (item.balance.code === 401){
                      item.token = "user not registered"
                    }else{
                      item.token = item.balance.data.token
                    }
                    newArray.push(item);
                })
                this.setState({
                    ...this.state,
                    drivers: newArray,
                    loading: false,
                    pagination,
                  });
            }).catch(function (error) {
                console.log(error);
            });
    }

    render() {
        return (
            <div>
            <Breadcrumb style={{padding:5}}>
            <Breadcrumb.Item>
              <Icon type="audit" />
              <span>Dealer</span>
            </Breadcrumb.Item>
            <Breadcrumb.Item>
              <span>Detail</span>
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
                <Descriptions title="Dealers Info" size="small" column={2}>
                  <Descriptions.Item label="name">{this.props.location.state.name}                    </Descriptions.Item>
                  <Descriptions.Item label="token"> {this.container}                                  </Descriptions.Item>
                  <Descriptions.Item label="agents total">{this.props.location.state.agents_total}    </Descriptions.Item>
                  <Descriptions.Item label="phone">{this.props.location.state.phone}                  </Descriptions.Item>
                  <Descriptions.Item label="drivers total">{this.props.location.state.drivers_total}  </Descriptions.Item>
                  <Descriptions.Item label="address">{this.props.location.state.address}              </Descriptions.Item>
                </Descriptions>
                <Tabs defaultActiveKey="1"  onChange={this.handleTableDriversChange} >
                    <TabPane tab="Agents" key="1">
                        <Table 
                            dataSource={this.state.data}
                            pagination={this.state.pagination} 
                            loading={this.state.loading}
                            onChange={this.handleTableChange}>
                            <Column title="name" dataIndex="name"  />
                            <Column title="phone" dataIndex="phone"  />
                            <Column title="address" dataIndex="address"  />
                            <Column title="token" dataIndex="token"/>
                            <Column title="drivers total" dataIndex="drivers_total"  />
                        </Table>
                    </TabPane>
                    <TabPane tab="Drivers" key="2">
                    <Table 
                            dataSource={this.state.drivers}
                            pagination={this.state.pagination} 
                            loading={this.state.loading}
                            onChange={this.handleTableDriversChange}>
                            <Column title="name" dataIndex="name"  />
                            <Column title="phone" dataIndex="phone"  />
                            <Column title="email" dataIndex="email"  />
                            <Column title="gender" dataIndex="gender"  />
                            <Column title="address" dataIndex="address"  />
                        </Table>
                    </TabPane>
                </Tabs>
            </Content>
            </div>
        )
    }
}

