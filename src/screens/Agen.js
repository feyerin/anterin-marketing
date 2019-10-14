import React, { Component } from "react";
import { Layout,Table } from "antd";
import axios from 'axios';
import { URL } from '../components/BaseUrl';
import DetailColumn from './DetailColumn';

const { Column } = Table;
const { Content } = Layout;

export class Agen extends Component {
  //Login verivikator
  constructor(props){
    super(props);
    if(localStorage.getItem("token") == null){
      this.props.history.push('/')
    }
  }

  state = {
    data : []
  };
  

  componentDidMount(){
    axios.get(URL + "/api/v1/marketing/agents?search=&sort=name&includes=",
    {
      headers : {
        Authorization : 'Bearer ' + localStorage.getItem("token")
      }
    })
    .then(response => {
      console.log(response);
      console.log("Agen");
      var newArray = [];
      response.data.data.forEach(item => {
        item.key = item.id;
        newArray.push(item);
      });
      this.setState({
        ...this.state,
        data: newArray
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
           {/* <Table
            columns={this.column} dataSource={this.state.data} pagination={{defaultPageSize: 20}}
          /> */}
         <Table dataSource={this.state.data}>
          <Column title="name" dataIndex="name"  />
          <Column title="phone" dataIndex="phone"  />
          <Column title="address" dataIndex="address"  />
          <Column title="token" dataIndex="token"  />
          <Column title="detail" dataIndex="detail" 
        render={
          (unused1,obj,unused2) => <DetailColumn history={this.props.history} data={obj}/>
        }
        > 
        </Column>
        </Table>,
        </Content>
        
      </div>
    );
  }
}

export default Agen;
