import React, { Component } from 'react';
import { Table,Layout,Tabs } from 'antd';
import axios from 'axios';


const { Column } = Table;
const { Content } = Layout;
const { TabPane } = Tabs;

export default class DistributorDetail extends Component {
    constructor(props) {
        super(props)
        console.log("TES PASSING DATA", props.location.state)
    }

    state = {
        data : [],
        drivers:[],
      };
      
    componentDidMount(){
        axios.get("https://oapi.anterin.id/api/v1/marketing/distributors/" + this.props.location.state.id + '/dealers',
            {
                headers: {
                    Authorization: 'Bearer ' + localStorage.getItem("token")
                }
            }).then(response => {
                console.log('dealer from distributor ', response.data.data);
                var newArray = [];
      response.data.data.forEach(item => {
        item.key = item.id;
        item.token = item.balance.data.token;
        newArray.push(item);
      });
      this.setState({
        ...this.state,
        data: newArray
      });
                
            }).catch(function (error) {
                console.log(error);
            });
    }

    onSwichDrivers = () => {
        const axios = require('axios');
        axios.get("https://oapi.anterin.id/api/v1/marketing/distributors/" + this.props.location.state.id + '/drivers',
            {
                headers: {
                    Authorization: 'Bearer ' + localStorage.getItem("token")
                }
            }).then(response => {
                console.log('drivers from distributor ', response.data.data);
                var newArray = [];
                response.data.data.forEach(item => {
                    item.key = item.id;
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
            <Content
                style={{
                    background: '#fff',
                    padding: 24,
                    margin: 0,
                    marginTop: 16,
                    minHeight: 280,
                }}
            >
                <p>nama    : {this.props.location.state.name}</p>
                <p>phone   : {this.props.location.state.phone}</p>
                <p>address : {this.props.location.state.address}</p>
                <p>token   : {this.props.location.state.balance.data.token}</p>
                <p>dealers total : {this.props.location.state.dealers_total}</p>
                <p>agen total : {this.props.location.state.agents_total}</p>
                <p>driver total : {this.props.location.state.drivers_total}</p>

                

                <Tabs defaultActiveKey="1" onChange={this.onSwichDrivers}>
                    <TabPane tab="Dealer" key="1">
                        <Table dataSource={this.state.data}>
                            <Column title="name" dataIndex="name"  />
                            <Column title="phone" dataIndex="phone"  />
                            <Column title="address" dataIndex="address"  />
                            <Column title="token" dataIndex="token"  />
                            <Column title="drivers total" dataIndex="drivers_total"  />
                        </Table>
                    </TabPane>
                    <TabPane tab="Drivers" key="2" >
                    <Table dataSource={this.state.drivers}>
                            <Column title="name" dataIndex="name"  />
                            <Column title="phone" dataIndex="phone"  />
                            <Column title="email" dataIndex="email"  />
                            <Column title="gender" dataIndex="gender"  />
                            <Column title="address" dataIndex="address"  />
                        </Table>
                    </TabPane>
                </Tabs>
            </Content>
        )
    }
}

