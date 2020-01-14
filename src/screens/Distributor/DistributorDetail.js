import React, { Component } from 'react';
import { Table, Layout, Tabs, Breadcrumb, Icon, Descriptions, Button, Divider, notification, DatePicker } from 'antd';
import axios from 'axios';
import ReactExport from "react-data-export";
import { URL } from "../../components/BaseUrl";


const ExcelFile = ReactExport.ExcelFile;
const ExcelSheet = ReactExport.ExcelFile.ExcelSheet;
const ExcelColumn = ReactExport.ExcelFile.ExcelColumn;
const { Column } = Table;
const { Content } = Layout;
const { TabPane } = Tabs;
const { RangePicker } = DatePicker;
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
        console.log("data from other component", props.location.state.balance.data[1].amount)
        if (props.location.state.balance.code === 401){
         modifiedData.token = "user not registered"
       }else{
           modifiedData.token = props.location.state.balance.data[1].amount
       }
        this.state = {
          data : [],
          agents :[],
          drivers:[],
          dataFromOtherComponent : modifiedData,
          pagination : {
              current : 1
            },
          loading: false,
          showMe: false,
          dateFrom: "",
          dateTo: "",
          dataToExport:[],
        };
    }

      handleTableDealerChange = (pagination) => {
        const pager = { ...this.state.pagination };
        console.log("PAGER", pager);
        pager.current = pagination.current;
        this.setState({
          ...this.state,
          pagination: pager
        },() => this.onSwitchDelaer());    
      }

      handleTableAgentsChange = (pagination) => {
        const pager = { ...this.state.pagination };
        console.log("PAGER", pager);
        pager.current = pagination.current;
        this.setState({
          ...this.state,
          pagination: pager
        },() => this.onSwitchAgents());    
      }

      handleTableDriversChange = (pagination) => {
        const pager = { ...this.state.pagination };
        console.log("PAGER", pager);
        pager.current = pagination.current;
        this.setState({
          ...this.state,
          pagination: pager
        },() => this.onSwitchDrivers());    
      }

      componentDidMount(){
        this.onSwitchDelaer();
        this.onSwitchAgents();
        this.onSwitchDrivers();
      }

      onSwitchDelaer = () => {
        this.setState({ 
          ...this.state,
          loading: true });
        axios.get(
          URL + "api/v1/marketing/distributors/" + this.props.location.state.id + "/dealers?from=" + this.state.dateFrom + "&to=" + this.state.dateTo + "&page=" + this.state.pagination.current,
          {
          headers : {
            Authorization: "Bearer "+ localStorage.getItem("token")
          }
        }).then(response => {
          console.log("dealer",response);
          const pagination = { ...this.state.pagination };
          pagination.total = response.data.pagination.total;
          var newArray = [];
          response.data.data.forEach(item => {
            item.key = item.id;
            item.token = item.balance.data[1].amount;
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

      onSwitchAgents = () => {
        this.setState({ 
            ...this.state,
            loading: true });
        axios.get(
            URL + "api/v1/marketing/distributors/" + this.props.location.state.id + "/agents?from=" + this.state.dateFrom + "&to=" + this.state.dateTo + "&page=" + this.state.pagination.current,
            {
                headers: {
                    Authorization: 'Bearer ' + localStorage.getItem("token")
                }
            }).then(response => {
                const pagination = { ...this.state.pagination };
                pagination.total = response.data.pagination.total;
                var newArray = [];
                response.data.data.forEach(item => {    
                  item.token = item.balance.data[1].amount;
                  item.created_at = item.created_at;
                  newArray.push(item);
                })
                this.setState({
                    ...this.state,
                    agents: newArray,
                    loading: false,
                    showMe:false,
                    pagination
                  });
            }).catch(function (error) {
                console.log(error);
            });
    }


    onSwitchDrivers = () => {
        this.setState({ 
            ...this.state,
            loading: true });
        const axios = require('axios');
        axios.get(
            URL + "api/v1/marketing/distributors/" + this.props.location.state.id + "/drivers?from=" + this.state.dateFrom + "&to=" + this.state.dateTo + "&page=" + this.state.pagination.current,
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
                    item.created_at = item.created_at.date;                   
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
         URL + "api/v1/marketing/distributors/" + this.props.location.state.id + '/dealers?limit=50' + this.state.pagination.current,
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
          item.token = item.balance.data[1].amount
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

    onChange=(dates, dateStrings) => {
      console.log('From: ', dateStrings[0], ', to: ', dateStrings[1]);
      this.setState({
        ...this.state,
        dateFrom : dateStrings[0],
        dateTo : dateStrings[1]
      }, () =>  this.componentDidMount())
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
                    minHeight: 230,
                }}>
                <Descriptions title="Distributor Info" size="small" column={2}>
                  <Descriptions.Item label="name">{this.state.dataFromOtherComponent.name}                    </Descriptions.Item>
                  <Descriptions.Item label="dealers total">{this.state.dataFromOtherComponent.dealers_total}  </Descriptions.Item>
                  <Descriptions.Item label="token"><a> {this.state.dataFromOtherComponent.token}</a>          </Descriptions.Item>
                  <Descriptions.Item label="agents total">{this.state.dataFromOtherComponent.agents_total}    </Descriptions.Item>
                  <Descriptions.Item label="phone">{this.state.dataFromOtherComponent.phone}                  </Descriptions.Item>
                  <Descriptions.Item label="drivers total">{this.state.dataFromOtherComponent.drivers_total}  </Descriptions.Item>
                  <Descriptions.Item label="address">{this.state.dataFromOtherComponent.address}              </Descriptions.Item>
                </Descriptions>
                </Content>

                <Content
                  style={{
                      background: '#fff',
                      padding: 24,
                      marginTop: 50,
                      minHeight: 280,
                  }}>                
                  <RangePicker style={{paddingTop:10, paddingBottom:10}} onChange={this.onChange} />
                  
                  <div style={{float:"right",marginTop:10, marginBottom:10}}>
                  <Button type="primary" 
                    onClick={this.ExportDealer}
                    loading={this.state.loading}> 
                    generate data
                  </Button>
                  <Divider type="vertical"/>
                  
                  {
                    this.state.showMe? 
                    <ExcelFile
                    filename="distributors" 
                    element={<Button onClick={() => openNotificationWithIcon('warning')}>export to Excel</Button>}>
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
                  </div>
        
                <Tabs defaultActiveKey="1" onChange={this.onSwitchDrivers}>
                    <TabPane tab="Dealer" key="1" onChange={this.onSwitchDelaer}>
                        <Table 
                            dataSource={this.state.data}
                            pagination={this.state.pagination} 
                            loading={this.state.loading}
                            onChange={this.handleTableDealerChange}>
                            <Column title="name" dataIndex="name"  />
                            <Column title="phone" dataIndex="phone"  />
                            <Column title="address" dataIndex="address"  />
                            <Column title="drivers total" dataIndex="drivers_total"  />
                            <Column title="created at" dataIndex="created_at"/>
                            <Column title="token" dataIndex="token"  />
                        </Table>
                    </TabPane>
                    <TabPane tab="Agents" key="2" onClick={this.onSwitchAgents}>
                        <Table 
                            dataSource={this.state.agents}
                            pagination={this.state.pagination} 
                            loading={this.state.loading}
                            onChange={this.handleTableAgentsChange}>
                            <Column title="name" dataIndex="name"  />
                            <Column title="phone" dataIndex="phone"  />
                            <Column title="address" dataIndex="address"  />
                            <Column title="drivers total" dataIndex="drivers_total"  />
                            <Column title="created at" dataIndex="created_at"/>
                            <Column title="token" dataIndex="token"  />
                        </Table>
                    </TabPane>
                    <TabPane tab="Drivers" key="3" onChange={this.onSwitchDrivers}>
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
                            <Column title="created at" dataIndex="created_at"/>
                        </Table>
                    </TabPane>
                </Tabs>
            </Content>
            </div>
        )
    }
}

