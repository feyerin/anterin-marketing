import React, { Component } from 'react';
import { Table,Layout,Tabs,Breadcrumb,Icon } from 'antd';
import axios from 'axios';


const { Column } = Table;
const { Content } = Layout;
const { TabPane } = Tabs;

export default class AgenDetail extends Component {
    constructor(props) {
        super(props)
        console.log("TES PASSING DATA", props.location.state)
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

      componentDidMount(){
        this.fetch();
      }

      fetch = () => {
        this.setState({ 
          ...this.state,
          loading: true });
        console.log("current page", this.state.pagination.current)
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
          console.log('pagination state', this.state.pagination);
          var newArray = [];
          response.data.data.forEach(item => {
            item.key = item.id;
            item.token = item.balance.data.token;
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

    // componentDidMount(){
    //     axios.get("https://oapi.anterin.id/api/v1/marketing/dealers/" + this.props.location.state.id + '/agents',
    //         {
    //             headers: {
    //                 Authorization: 'Bearer ' + localStorage.getItem("token")
    //             }
    //         }).then(response => {
    //             console.log('NESTEDCALLAPI ', response.data.data);
    //             var newArray = [];
    //   response.data.data.forEach(item => {
    //     item.key = item.id;
    //     newArray.push(item);
    //   });
    //   this.setState({
    //     ...this.state,
    //     data: newArray
    //   });
                
    //         }).catch(function (error) {
    //             console.log(error);
    //         });
    // }

    onSwichDrivers = () => {
        const axios = require('axios');
        axios.get("https://oapi.anterin.id/api/v1/marketing/dealers/" + this.props.location.state.id + '/drivers',
            {
                headers: {
                    Authorization: 'Bearer ' + localStorage.getItem("token")
                }
            }).then(response => {
                console.log('NESTEDCALLAPI ', response.data.data);
                var newArray = [];
                response.data.data.forEach(item => {
                    item.key = item.id;
                    item.token = item.balance.data.token;
                    newArray.push(item);
                })
                this.setState({
                    ...this.state,
                    drivers: newArray
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
                <p>name          : {this.props.location.state.name}</p>
                <p>phone         : {this.props.location.state.phone}</p>
                <p>address       : {this.props.location.state.address}</p>
                <p>agents total  : {this.props.location.state.agents_total}</p>
                <p>drivers total : {this.props.location.state.drivers_total}</p>
                <p>token         : {this.props.location.state.balance.data.token}</p>

                <Tabs defaultActiveKey="1"  onChange={this.onSwichDrivers} >
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
                            onChange={this.handleTableChange}>
                            <Column title="name" dataIndex="name"  />
                            <Column title="phone" dataIndex="phone"  />
                            <Column title="email" dataIndex="email"  />
                            <Column title="gender" dataIndex="gender"  />
                            <Column title="address" dataIndex="address"  />
                            <Column title="drivers total" dataIndex="drivers_total"  />
                        </Table>
                    </TabPane>
                </Tabs>
            </Content>
            </div>
        )
    }
}

