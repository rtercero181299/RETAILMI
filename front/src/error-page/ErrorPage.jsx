import React, { Component } from "react";
import "./error-page.css"


export default class ErrorPage extends Component{
    constructor(props){
        super(props)
    }
    render() {
        return (
            <div className="error-page h-100 w-100 d-flex justify-items-center align-items-center">
                <h1 className="text-center">HA OCURRIDO UN ERROR</h1>
            </div>
        )
    }
}