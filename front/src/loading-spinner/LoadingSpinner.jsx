/**
 * Modulos
 */
import React, {Component} from "react"
import {SpinnerDotted} from "spinners-react"
 /**
  * assets
  */
import logo from "../assets/img/logo.png"
/**
 * Estilos
 */
import "./loading-spinner.css"
export default class LoadingSpinner extends Component{
    constructor(props){
        super(props)
    }

    render(){
        return(
            <div className="loading-spinner w-100 d-flex justify-content-center align-items-center flex-column">

                <img 
                src={logo} 
                alt="ARDABYTEC S.A DE C.V" 
                className="logo-loading" 
                width="70%"
                />
                <SpinnerDotted
                    size={300}
                    color="#02c8ed"
                />
            </div>
        )
    }
}