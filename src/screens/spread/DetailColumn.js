import React, { Component } from "react";
import { Table, Button } from "antd";

const { Column } = Table;

export default class DetailColumn extends Component {
    state = {
        userData: {}
    }
    onDetail = () => {
        const axios = require('axios');
        axios.get("https://oapi.anterin.id/api/v1/marketing/spread/" + this.props.data.id,
            {
                headers: {
                    Authorization: 'Bearer ' + localStorage.getItem("token")
                }
            }).then(response => {
                console.log('response: ', response.data.data);
                this.props.history.push(
                    {
                        pathname: "/DistributorDetail",
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
                <Button type="primary" onClick={this.onDetail}>Detail</Button>
            </div>
        );
    }
}