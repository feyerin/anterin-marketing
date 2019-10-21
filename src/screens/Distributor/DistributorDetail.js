import React, { Component } from 'react';
import { Table,Layout,Tabs,Breadcrumb,Icon,Descriptions,Button, Divider,notification } from 'antd';
import axios from 'axios';
import { CSVLink } from "react-csv";
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

export default class DistributorDetail extends Component {
  
    constructor(props) {
        super(props)
        let modifiedData = props.location.state
        if (props.location.state.balance.code === 401){
         modifiedData.token = "user not registered"
       }else{
           modifiedData.token = props.location.state.balance.data.token
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
        axios.get(
            "https://oapi.anterin.id/api/v1/marketing/distributors/" + this.props.location.state.id + '/drivers?page='
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
                    showMe:false,
                    pagination
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
        "https://oapi.anterin.id/api/v1/marketing/distributors/" + this.props.location.state.id + '/dealers?limit=50'
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
            dealers_total:this.state.dataFromOtherComponent.dealers_total,
            agents_total:this.state.dataFromOtherComponent.agents_total,
            drivers_total:this.state.dataFromOtherComponent.drivers_total,
            token:this.state.dataFromOtherComponent.token
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
                }}>
                <Descriptions title="Distributor Info" size="small" column={2}>
                  <Descriptions.Item label="name">{this.state.dataFromOtherComponent.name}                    </Descriptions.Item>
                  <Descriptions.Item label="dealers total">{this.state.dataFromOtherComponent.dealers_total}  </Descriptions.Item>
                  <Descriptions.Item label="token"><a> {this.state.dataFromOtherComponent.token}</a>          </Descriptions.Item>
                  <Descriptions.Item label="agents total">{this.state.dataFromOtherComponent.agents_total}    </Descriptions.Item>
                  <Descriptions.Item label="phone">{this.state.dataFromOtherComponent.phone}                  </Descriptions.Item>
                  <Descriptions.Item label="drivers total">{this.state.dataFromOtherComponent.drivers_total}  </Descriptions.Item>
                  <Descriptions.Item label="address">{this.state.dataFromOtherComponent.address}              </Descriptions.Item>
                  <Descriptions.Item label="Export Dealer">  
                    <Button type="primary" size="small" 
                      onClick={this.ExportDealer}
                      loading={this.state.loading}> 
                      genetate data
                    </Button>
                    <Divider type="vertical"/>
                    {
                     this.state.showMe? 
                    // <CSVLink
                    //   onClick={() => openNotificationWithIcon('warning')}
                    //   data={this.state.data}
                    //   filename={"my-file.csv"}
                    // >Export to CSV</CSVLink>
                    <ExcelFile 
                      filename="distributors" 
                      element={<Button size="small">export to Excel</Button>}>
                    <ExcelSheet data={this.state.dataToExport} name="distributors" >
                        <ExcelColumn label="Name" value="name"/>
                        <ExcelColumn label="phone" value="phone"/>
                        <ExcelColumn label="address" value="address"/>
                        <ExcelColumn label="dealers total" value="deales_total"/>
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

