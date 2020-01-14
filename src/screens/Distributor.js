import React, { Component } from "react";
import {Table,Layout,Breadcrumb,Icon,Divider,Tooltip,Input,Button, DatePicker} from "antd";
import axios from "axios";
import {URL} from "../components/BaseUrl";
import DetailColumn from "../screens/Distributor/DetailColumn";
import { CSVLink } from "react-csv";

const { Content } = Layout;
const{Column} = Table;
const { RangePicker } = DatePicker;


export default class Distributor extends Component {
  //Login verivikator
  constructor(props){
    super(props);
    if(localStorage.getItem("token") == null){
      this.props.history.push('/')
    }
  }

    state = {
        data : [],
        loading : false,
        searchValue: "",
        pagination : {
          current : 1
        },
        dateFrom : "",
        dateTo : "",
      };

      componentDidMount(){
        this.fetch();
      }

      handleTableChange = (pagination) => {
        const pager = { ...this.state.pagination };
        console.log("PAGER", pager);
        pager.current = pagination.current;
        this.setState({
          ...this.state,
          pagination: pager,
        },() => this.fetch());    
      }

      fetch = () =>{
      this.setState({ loading: true });
      console.log("current page", this.state.pagination.current)
      axios.get(URL + "api/v1/marketing/distributors?search=" + this.state.searchValue +"&sort=name&from="+ this.state.dateFrom + "&to=" +this.state.dateTo + "&page=" + this.state.pagination.current,
      {
        headers : {
          Authorization : 'Bearer ' + localStorage.getItem("token")
        }
      })
      .then(response => {
        console.log(response);
        const pagination = { ...this.state.pagination };
        pagination.total = response.data.pagination.total;
        var newArray = [];
        response.data.data.forEach(item => {
          item.key = item.id;
          if (item.balance.data[1].amount === 401){
            item.token = "user not registered"
          }else{
            item.token = item.balance.data[1].amount
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
      .catch((error) => {
        console.log(error);
        this.setState({ 
          ...this.state, loading:false });
      })
    }

    getSearchValue = (e) => {
      this.setState({
        ...this.state,
        searchValue: e.target.value
      })
      console.log(e.target.value)
    }

    onClicked = () => {
      console.log(this)
      this.fetch(this.state.searchValue)
    }

    onChange=(dates, dateStrings) => {
      console.log('From: ', dateStrings[0] );
      console.log(' to: ', dateStrings[1] );
      this.setState({
        ...this.state,
        dateFrom : dateStrings[0],
        dateTo : dateStrings[1]
      }, () =>  this.componentDidMount())
    }

    render(){
        return(
          <div>
            <Breadcrumb style={{padding:5}}>
            <Breadcrumb.Item>
              <Icon type="idcard" />
              <span>Distributor</span>
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
            <Tooltip title="wait until data fully loaded">
              <CSVLink 
                style={{float:"right"}} 
                data={this.state.data}
                filename={"list-distributors.csv"}>
                Export to CSV 
              </CSVLink>
            </Tooltip>
            <Input style={{width:200}}
            prefix={<Icon type="search" style={{ color: 'rgba(0,0,0,.25)' }} />}
            placeholder="search text value"
            onChange={(e) => this.getSearchValue(e)}
            />
            <Divider type="vertical"/>
            <Button
              type="primary"
              shape="circle"
              icon="search"
              onClick={() => this.onClicked()}
              loading={this.state.loading}>
            </Button>
            <Divider/>
            <RangePicker style={{paddingBottom:20}} onChange={this.onChange} />
            
              <Table 
                dataSource={this.state.data} 
                pagination={this.state.pagination} 
                loading={this.state.loading}
                onChange={this.handleTableChange}>
                <Column title="name" dataIndex="name"  />
                <Column title="phone" dataIndex="phone"  />
                <Column title="email" dataIndex="email"  />
                <Column title="address" dataIndex="address"  />
                <Column title="token" dataIndex="token"  />
                <Column title="created at" dataIndex="created_at"/>
                <Column title="detail" dataIndex="detail" 
                  render={
                    (unused1,obj,unused2) => <DetailColumn history={this.props.history} data={obj}/>
                  }> 
                </Column>
              </Table>
            </Content>
          </div>
      );
    }
}