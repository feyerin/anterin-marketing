import React, { Component } from 'react';
import { Table,Layout,Tabs,Descriptions,Breadcrumb,Icon } from 'antd';
import axios from 'axios';
import { URL } from "../../components/BaseUrl";

const { Column } = Table;
const { Content } = Layout;
const { TabPane } = Tabs;

export default class SpreadDetail extends Component {
    constructor(props) {
        super(props)
        console.log("TES PASSING DATA", props.location.state)
        this.state = {
            data : [],
            drivers:[],
            loading:false,
        };   
    }
    componentDidMount(){
        this.fetch();
    }

      fetch = () => {
        this.setState({ 
          ...this.state,
          loading: true });
        axios.get(
          URL + "api/v1/marketing/spread/" + this.props.location.state.province_id + '/cities',
          {
          headers : {
            Authorization: "Bearer "+ localStorage.getItem("token")
          }
        }).then(response => {
          console.log(response);
          var newArray = [];
          response.data.data.forEach(item => {
            item.key = item.city_id;
            newArray.push(item);
          });
          this.setState({
            ...this.state,
            data: newArray,
            loading: false,
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

                <Descriptions title="Spread Info" size="small" column={2}>
                    <Descriptions.Item label="name">{this.props.location.state.name}                    </Descriptions.Item>
                    <Descriptions.Item label="distributors"> {this.props.location.state.distributors}   </Descriptions.Item>
                    <Descriptions.Item label="dealers total">{this.props.location.state.dealers_total}  </Descriptions.Item>
                    <Descriptions.Item label="agents total">{this.props.location.state.agents_total}    </Descriptions.Item>
                    <Descriptions.Item label="drivers total">{this.props.location.state.drivers_total}  </Descriptions.Item>
                </Descriptions>

                <Tabs defaultActiveKey="1">
                    <TabPane tab="Cities" key="1">
                        <Table 
                          loading={this.state.loading}
                          dataSource={this.state.data}>
                            <Column title="name" dataIndex="name"  />
                            <Column title="distributors" dataIndex="distributors"  />
                            <Column title="dealers" dataIndex="dealers"  />
                            <Column title="agents" dataIndex="agents"  />
                            <Column title="drivers" dataIndex="drivers"  />
                        </Table>
                    </TabPane>
                </Tabs>
            </Content>
          </div>
        )
    }
}

