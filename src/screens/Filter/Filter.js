import React, { Component } from "react";
import {Table,Layout,Breadcrumb,Icon,Divider,Tooltip,Input,Button, DatePicker} from "antd";
import axios from "axios";
import { CSVLink } from "react-csv";
import { Link } from "react-router-dom";
import { URL } from "../../components/BaseUrl";


const { RangePicker } = DatePicker;
const { Content } = Layout;
const{Column} = Table;

export default class Filter extends Component {
  //Login verivikator
  constructor(props){
    super(props);
    if(localStorage.getItem("token") == null){
      this.props.history.push('/')
    }
    this.state = {
      data : [],
      loading : false,
      searchValue: "",
      startValue: "",
      endValue: "",
      endOpen: false,
      dateRange: "",
    };
  }

      componentDidMount(){
        this.fetch();
      }

    fetch = () =>{
        this.setState({ ...this.state, loading: true });
        axios.get("https://oapi-rv.anterin.id/api/v1/marketing/distributors?search=" + this.state.searchValue +"&sort=name&includes=" + "&from=" + this.state.startValue + "&to=" + this.state.endValue, //disini. yaudah tinggal run
        {
            headers : {
            Authorization : 'Bearer ' + localStorage.getItem("token")
            }
        })
        .then(response => {
            console.log(response);
            console.log("seach value :", this.state.searchValue)
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
            });
        })
        .catch(function(error) {
            console.log(error);
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

    disabledStartDate = startValue => {
      const { endValue } = this.state;
      if (!startValue || !endValue) {
        return false;
      }
      return startValue.valueOf() > endValue.valueOf();
    };
  
    disabledEndDate = endValue => {
      const { startValue } = this.state;
      if (!endValue || !startValue) {
        return false;
      }
      return endValue.valueOf() <= startValue.valueOf();
    };
    
    onChange=(dates, dateStrings) => {
      console.log('From: ', dateStrings[0], ', to: ', dateStrings[1]);
      this.setState({
        ...this.state,
        startValue : dateStrings[0],
        endValue : dateStrings[1]
      }, () =>  this.fetch())
    }
  
    render(){
        return(
          <div>
            <Breadcrumb style={{padding:5}}>
                <Breadcrumb.Item>
                <Icon type="idcard" />
                <span>Filter</span>
                </Breadcrumb.Item>
            </Breadcrumb>

            <Content
              style={{
              background: '#fff',
              padding: 24,
              margin: 0,
              minHeight: 280,}}>

                <Tooltip title="wait until data fully loaded">
                <CSVLink 
                    style={{float:"right"}} 
                    data={this.state.data}
                    filename={"list-distributors.csv"}>
                    Export to CSV 
                </CSVLink>
                </Tooltip>
            
                <Divider/>
                <div style={{paddingBottom:15}}>

                <RangePicker
                  onChange={this.onChange}
                />

                  <div style={{float:"right"}}>

                      <Input style={{width:200}}
                          prefix={<Icon type="search" style={{ color: 'rgba(0,0,0,.25)' }} />}
                          placeholder="search text value"
                          onChange={(e) => this.getSearchValue(e)}/>
                      <Divider type="vertical"/>
                      
                      <Button
                      type="primary"
                      shape="circle"
                      icon="search"
                      onClick={() => this.onClicked()}
                      loading={this.state.loading}/>
                  </div>
                </div>

                <Table 
                    dataSource={this.state.data} 
                    pagination={{defaultPageSize: 20}} 
                    loading={this.state.loading}>
                    <Column title="Distributor" dataIndex="name"/>
                    <Column title="Dealer"
                        render={data =>  (
                            <span>
                                <Link to="/FilterDealer">{data.dealers_total}</Link>
                            </span>)}  />
                    <Column title="Agent" 
                       render={data =>  (
                        <span>
                            <Link to="/FilterDealer">{data.agents_total}</Link>
                        </span>)}  />
                    <Column title="Driver" 
                        render={data =>  (
                          <span>
                              <Link to="/FilterDealer">{data.drivers_total}</Link>
                          </span>)}  />
                    <Column title="total token" dataIndex="token"/>
                </Table>
            </Content>
        </div>
      );
    }
}