import React, { Component } from "react";
import { Button } from "antd";
import { URL } from "../../components/BaseUrl";

export default class DetailColumn extends Component {
    state = {
        userData: {},
        loading:false
    }
    onDetail = () => {
        this.setState({ loading: true });
        const axios = require('axios');
        axios.get(URL + "/api/v1/marketing/dealers/" + this.props.data.id,
            {
                headers: {
                    Authorization: 'Bearer ' + localStorage.getItem("token")
                }
            }).then(response => {
                console.log('response: ', response.data.data);
                this.props.history.push(
                    {
                        pathname: "/DealerDetail",
                        state: response.data.data
                    }
                )
            }).catch(function (error) {
                console.log(error);
            });
    }


    render() {
        return (
            <div>
                <Button type="primary" 
                onClick={this.onDetail}
                loading={this.state.loading}
                >Detail</Button>
            </div>
        );
    }
}