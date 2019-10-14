import React, { Component } from "react";
import { Layout,Table,Pagination } from "antd";
import {URL} from "../components/BaseUrl";
import axios from 'axios';
import DetailColumn from '../screens/spread/DetailColumn';


const { Column } = Table;
const { Content } = Layout;

export class Home extends Component {
  //verivikator login
  constructor(props){
    super(props);
    console.log(localStorage.getItem("token"))
    if(localStorage.getItem("token") == null){
      this.props.history.push('/')
      console.log("login")
    }
  }
  state = {
    data : [],
    pagination : {},
    loading : false
  };

  handleTableChange = (pagination) => {
    const pager = { ...this.state.pagination };
    pager.current = pagination.current;
    this.setState({
      pagination: pager,
    });
    this.fetch({
      results: pagination.pageSize,
      page: pagination.current,
    });
  };

  

  

  componentDidMount(){
    this.setState({ loading: true });
    axios.get(URL + "api/v1/marketing/spread",
    {
      headers : {
        Authorization : 'Bearer ' + localStorage.getItem("token")
      }
    }
    )
    .then(response => {
      console.log(response);
      console.log("Agen");
      var newArray = [];
      response.data.data.forEach(item => {
        item.key = item.province_id;
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
        <Content
          style={{
            background: '#fff',
            padding: 24,
            margin: 0,
            marginTop: 16,
            minHeight: 280,
          }}
        >
        <Table dataSource={this.state.data} pagination={true}  >
          <Column title="name" dataIndex="name"  />
          <Column title="distributors" dataIndex="distributors"  />
          <Column title="dealers total" dataIndex="dealers_total"  />
          <Column title="agent total" dataIndex="agents_total"  />
          <Column title="drivers total" dataIndex="drivers_total" />
          {/* <Column title="detail" dataIndex="detail"  
          // render={
          //   (unused1,obj,unused2) => <DetailColumn history={this.props.history} data={obj}/>
          // }
           
          /> */}
          
          </Table>
        </Content>

      </div>
    );
  }
}

export default Home;