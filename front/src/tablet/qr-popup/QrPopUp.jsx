import React, { Component } from "react";
import dfimage from "../../assets/img/df-user.png";
import { Image } from 'react-bootstrap';
import "./qr-popup.css";

export default class QrPopUp extends Component{
    constructor(props){
        super(props);
    }

    render() {
        console.log("qr: ", this.props.src)
        return (
            <div className="qr-pupup d-flex p-3 justify-content-center align-items-center h-75">
                <Image height={"100%"} width={"100%"} src={this.props.src?this.props.src:dfimage}/>
            </div>
        )
    }
}