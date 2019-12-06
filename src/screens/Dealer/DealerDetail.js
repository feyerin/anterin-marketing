import React, { Component } from 'react';
import { Table,Layout,Tabs,Breadcrumb,Icon,Descriptions,notification,Button,Divider } from 'antd';
import axios from 'axios';
import ReactExport from "react-data-export";

const ExcelFile = ReactExport.ExcelFile;
const ExcelSheet = ReactExport.ExcelFile.ExcelSheet;
const ExcelColumn = ReactExport.ExcelFile.ExcelColumn;
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

export default class AgenDetail extends Component {
    constructor(props) {
        super(props)
        let modifiedData = props.location.state
        if (modifiedData.balance.code === 401){
          this.container = "user not registered"
       }else{
           this.container = modifiedData.balance.data.token
       }
       this.state = {
        data : [],
        dataFromOtherComponent : modifiedData,
        drivers:[],
        pagination : {
            current : 1
          },
        loading: false,
        showMe: false,
        dataToExport:[],
      };
    }
      
      handleTableChange = (pagination) => {
        const pager = { ...this.state.pagination };
        pager.current = pagination.current;
        this.setState({
          ...this.state,
          pagination: pager
        },() => this.fetch());    
      }

      handleTableDriversChange = (pagination) => {
        const pager = { ...this.state.pagination };
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
          pagination.total = response.data.pagination.total;
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
        const axios = require('axios');
        axios.get("https://oapi.anterin.id/api/v1/marketing/dealers/" + this.props.location.state.id + '/drivers?page='
        + this.state.pagination.current,
            {
                headers: {
                    Authorization: 'Bearer ' + localStorage.getItem("token")
                }
            }).then(response => {
                const pagination = { ...this.state.pagination };
                pagination.total = response.data.pagination.total;
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

    ExportDealer = () => {
      this.setState({ loading: true });
      var self = this
      var newArray = [];
      axios.get(
        "https://oapi.anterin.id/api/v1/marketing/dealers/" + this.props.location.state.id + '/agents?limit=100'
        + this.state.pagination.current,
        {
        headers : {
          Authorization: "Bearer "+ localStorage.getItem("token")
        }
      }).then(response => {
        console.log(response)
        let dataSet1 =[
          {
            name:this.state.dataFromOtherComponent.name,
            phone:this.state.dataFromOtherComponent.phone,
            address:this.state.dataFromOtherComponent.address,
            agents_total:this.state.dataFromOtherComponent.agents_total,
            drivers_total:this.state.dataFromOtherComponent.drivers_total,
            token:this.container
          }
        ]
        response.data.data.forEach(item => {
          item.key = item.id;
          if (item.balance.code === 401){
            item.token = "user not registered"
          }else{
            item.token = item.balance.data.token
          }
          newArray.push(item);
        },()=> console.log("dataset1:", this.dataSet1));
        self.setState({
          ...self.state,
          dataToExport: dataSet1,
          data: newArray,
          loading:false,
          showMe:true
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
                  <Descriptions.Item label="Export Dealer">  
                    <Button type="primary" size="small" 
                      onClick={this.ExportDealer}
                      loading={this.state.loading}> 
                      generate data
                    </Button>
                    <Divider type="vertical"/>
                    {
                     this.state.showMe? 
                    <ExcelFile 
                      
                      filename="dealers" 
                      element={<Button size="small" onClick={() => openNotificationWithIcon('warning')}>export to Excel</Button>}>
                    <ExcelSheet data={this.state.dataToExport} name="distributors" >
                        <ExcelColumn label="Name" value="name"/>
                        <ExcelColumn label="phone" value="phone"/>
                        <ExcelColumn label="address" value="address"/>
                        <ExcelColumn label="agents total" value="agents_total"/>
                        <ExcelColumn label="drivers total" value="drivers_total"/>
                        <ExcelColumn label="token" value="token"/>
                    </ExcelSheet>
                    <ExcelSheet data={this.state.data} name="dealers" >
                        <ExcelColumn label="Name" value="name"/>
                        <ExcelColumn label="phone" value="phone"/>
                        <ExcelColumn label="address" value="address"/>
                        <ExcelColumn label="drivers total" value="drivers_total"/>
                        <ExcelColumn label="token" value="token"/>
                    </ExcelSheet>
                    </ExcelFile>
                    :null
                    } 
                  </Descriptions.Item>
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
                            <Column title="drivers total" dataIndex="drivers_total"  />
                            <Column title="created at" dataIndex="created_at"/>
                            <Column title="token" dataIndex="token"/>
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
                            <Column title="created at" dataIndex="created_at"/>
                        </Table>
                    </TabPane>
                </Tabs>
            </Content>
            </div>
        )
    }
}

