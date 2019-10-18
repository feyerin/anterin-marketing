import React, { Component } from 'react';
import { Table,Layout,Tabs,Breadcrumb,Icon,Descriptions,Button, Divider,notification } from 'antd';
import axios from 'axios';
import { CSVLink } from "react-csv";



const { Column } = Table;
const { Content } = Layout;
const { TabPane } = Tabs;
const openNotificationWithIcon = type => {
  notification[type]({
    message: 'attention',
    description:
      'always click generate button before exporting data to CSV or the data will be not complete',
  });
};

export default class DistributorDetail extends Component {
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
        showMe: false
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
        console.log("current page dealers", this.state.pagination.current)
        axios.get(
          "https://oapi.anterin.id/api/v1/marketing/distributors/" + this.props.location.state.id + '/dealers?page='
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
            console.log("page from drivers", this.state.pagination.current)
        const axios = require('axios');
        axios.get(
            "https://oapi.anterin.id/api/v1/marketing/distributors/" + this.props.location.state.id + '/drivers?page='
            + this.state.pagination.current,
            {
                headers: {
                    Authorization: 'Bearer ' + localStorage.getItem("token")
                }
            }).then(response => {
                const pagination = { ...this.state.pagination };
                pagination.total = 1000;
                console.log('pagination state drivers2', this.state.pagination.current);
                console.log('drivers from distributor ', response.data.data);
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
                    showMe:false,
                    pagination
                  });
            }).catch(function (error) {
                console.log(error);
            });
    }

    ExportDealer = () => {
      this.setState({ loading: true });
      axios.get(
        "https://oapi.anterin.id/api/v1/marketing/distributors/" + this.props.location.state.id + '/dealers?limit=50'
        + this.state.pagination.current,
        {
        headers : {
          Authorization: "Bearer "+ localStorage.getItem("token")
        }
      }).then(response => {
        console.log("response", response);
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
          loading:false,
          showMe:true

        });
        console.log("data  :", this.state.data)
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
              <Icon type="idcard" />
              <span>Distributor</span>
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

                <Descriptions title="Distributor Info" size="small" column={2}>
                  <Descriptions.Item label="name">{this.props.location.state.name}                    </Descriptions.Item>
                  <Descriptions.Item label="dealers total">{this.props.location.state.dealers_total}  </Descriptions.Item>
                  <Descriptions.Item label="token"><a> {this.container}</a>                           </Descriptions.Item>
                  <Descriptions.Item label="agents total">{this.props.location.state.agents_total}    </Descriptions.Item>
                  <Descriptions.Item label="phone">{this.props.location.state.phone}                  </Descriptions.Item>
                  <Descriptions.Item label="drivers total">{this.props.location.state.drivers_total}  </Descriptions.Item>
                  <Descriptions.Item label="address">{this.props.location.state.address}              </Descriptions.Item>
                  <Descriptions.Item label="Export Dealer">  
                    <Button type="primary" size="small" 
                      onClick={this.ExportDealer}
                      loading={this.state.loading}> 
                      genetate data
                    </Button>
                    <Divider type="vertical"/>
                    {
                     this.state.showMe? 
                    <CSVLink
                      onClick={() => openNotificationWithIcon('warning')}
                      data={this.state.data} 
                      filename={"distributors-dealer.csv"}>
                      Export to CSV
                    </CSVLink>
                    :null
                    } 
                  </Descriptions.Item>
                  
                </Descriptions>
                
                <Tabs defaultActiveKey="1" onChange={this.onSwichDrivers}>
                    <TabPane tab="Dealer" key="1">
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
                    </TabPane>
                    <TabPane tab="Drivers" key="2" >
                    <Table 
                            dataSource={this.state.drivers}
                            pagination={this.state.pagination} 
                            loading={this.state.loading}
                            onChange={this.handleTableDriversChange}>>
                            <Column title="name" dataIndex="name"  />
                            <Column title="phone" dataIndex="phone"  />
                            <Column title="email" dataIndex="email"  />
                            <Column title="gender" dataIndex="gender"  />
                            <Column title="address" dataIndex="address"  />
                            <Column title="token" dataIndex="token"  />
                        </Table>
                    </TabPane>
                </Tabs>
            </Content>
            </div>
        )
    }
}

