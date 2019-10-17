import React, { Component } from 'react';
import { Table,Layout,Breadcrumb,Icon,Descriptions } from 'antd';
import axios from 'axios';
import {URL} from '../components/BaseUrl';

const { Column } = Table;
const { Content } = Layout;

export default class AgenDetail extends Component {
    
    constructor(props) {
        super(props)
        //var container = '';
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
      };
      

    componentDidMount(){
        axios.get(URL + "api/v1/marketing/agents/" + this.props.location.state.id + '/drivers',
            {
                headers: {
                    Authorization: 'Bearer ' + localStorage.getItem("token")
                }
            }).then(response => {
                console.log('NESTEDCALLAPI ', response.data.data);
                var newArray = [];
      response.data.data.forEach(item => {
        item.key = item.id;
        if (item.balance.code === 401){
            item.token = "user not registered"
          }else{
            item.token = item.balance.data.token
          }
        newArray.push(item);
        console.log ("get token :", item.balance.data.token)
      });
      this.setState({
        ...this.state,
        data: newArray
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
                    minHeight: 280,
                }}
            >
                <Descriptions title="Dealers Info" size="small" column={2}>
                  <Descriptions.Item label="name">{this.props.location.state.name}                    </Descriptions.Item>
                  <Descriptions.Item label="token"> <a>{this.container}</a>                           </Descriptions.Item>
                  <Descriptions.Item label="phone">{this.props.location.state.phone}                  </Descriptions.Item>
                  <Descriptions.Item label="drivers total">{this.props.location.state.drivers_total}  </Descriptions.Item>
                  <Descriptions.Item label="address">{this.props.location.state.address}              </Descriptions.Item>
                </Descriptions>

                    <Table dataSource={this.state.data}>
                        <Column title="name" dataIndex="name"  />
                        <Column title="phone" dataIndex="phone"  />
                        <Column title="address" dataIndex="address"  /> 
                        <Column title="token" dataIndex="token"/>
                    </Table>
            </Content>
            </div>
        )
    }
}

