import React, { Component } from "react";
import { Button } from "antd";

export default class DetailColumn extends Component {
    state = {
        userData: {},
        loading:false
    }
    onDetail = () => {
        this.setState({ loading: true });
        const axios = require('axios');
        console.log('data.id :', this.props.data.id)
        axios.get("https://oapi.anterin.id/api/v1/marketing/spread/" + this.props.data.province_id,
            {
                headers: {
                    Authorization: 'Bearer ' + localStorage.getItem("token")
                }
            }).then(response => {
                console.log('response: ', response.data.data);
                this.props.history.push(
                    {
                        pathname: "/SpreadDetail",
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