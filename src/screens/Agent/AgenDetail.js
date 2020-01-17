import React, { Component } from 'react';
import { Table,Layout,Breadcrumb,Icon,Descriptions, DatePicker } from 'antd';
import axios from 'axios';
import { URL } from "../../components/BaseUrl";

const { Column } = Table;
const { Content } = Layout;
const { RangePicker } = DatePicker;

export default class AgenDetail extends Component {
    constructor(props) {
        super(props)
        if (props.location.state.balance.code === 401){
           this.container = "user not registered"
        }else{
            this.container = props.location.state.balance.data[1].amount
        }
        this.state = {
          data : [],
          drivers : [],
          pagination :
            {
              current : 1
            },
          loading :false,
          dateFrom : "",
          dateTo : "",
        };
    }

    handleTableChange = (pagination) => {
      const pager = { ...this.state.pagination };
      pager.current = pagination.current;
      this.setState({
        ...this.state,
        pagination: pager
      },() => this.componentDidMount());    
    }

    componentDidMount(){
      this.setState({ 
        ...this.state,
        loading: true,
      });
        const pagination = { ...this.state.pagination };
        axios.get(URL + "api/v1/marketing/agents/" + this.props.location.state.id + "/drivers?from=" + this.state.dateFrom + "&to=" + this.state.dateTo + "&page=" + this.state.pagination.current + "&sort=name",
            {
                headers: {
                    Authorization: 'Bearer ' + localStorage.getItem("token")
                }
            }).then(response => {
                console.log('NESTEDCALLAPI ', response.data.data);
                var newArray = [];
                pagination.total = response.data.pagination.total;
                response.data.data.forEach(item => {
                  item.key = item.id;
                  item.created_at = item.created_at.date;
                  newArray.push(item);
                });
                this.setState({
                  ...this.state,
                  data: newArray,
                  loading: false,
                  pagination,
                });
            }).catch(function (error) {
                console.log(error);
            });
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
                <Icon type="audit" />
                <span>Agents</span>
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
                    minHeight: 220,
                }}>

                <Descriptions title="Dealers Info" size="small" column={2}>
                  <Descriptions.Item label="name">{this.props.location.state.name}                    </Descriptions.Item>
                  <Descriptions.Item label="token"> <a>{this.container}</a>                           </Descriptions.Item>
                  <Descriptions.Item label="phone">{this.props.location.state.phone}                  </Descriptions.Item>
                  <Descriptions.Item label="drivers total">{this.props.location.state.drivers_total}  </Descriptions.Item>
                  <Descriptions.Item label="address">{this.props.location.state.address}              </Descriptions.Item>
                </Descriptions>

                </Content>

                <Content
                style={{
                    background: '#fff',
                    padding: 24,
                    marginTop: 30,
                    minHeight: 280,
                }}>

                <RangePicker style={{paddingTop:10, paddingBottom:20}} onChange={this.onChange} />

                <Table 
                  dataSource={this.state.data}
                  pagination={this.state.pagination} 
                  loading={this.state.loading}
                  onChange={this.handleTableChange}>
                  <Column title="name" dataIndex="name"  />
                  <Column title="phone" dataIndex="phone"  />
                  <Column title="address" dataIndex="address"  /> 
                  <Column title="created at" dataIndex="created_at"/>
                </Table>
            </Content>
          </div>
        )
    }
}

