import React, { Component } from "react";
import { Button } from 'react-bootstrap';
import Menu from "./menu/Menu";

import "./vista-producto.css"

export default class VistaProducto extends Component{
    constructor(props){
        super(props)
    }
    render() {
        // console.log("producto recibido: ", this.props.producto);
        return (
            <div className="w-100 h-100 vista-producto d-flex align-items-center ">
                {
                this.props.producto?.video?
                    this.props.producto.video:
                    <p className="text-center w-100">No se ha podido cargar el video</p>
                }
                <div className="btn-salir">
                    <Button 
                        onClick={()=>this.props.onChangeVista(1)} 
                        variant={'danger'}>SALIR</Button>
                </div>
                <div className="position-menu">
                    <Menu 
                        onChangeVista={(vista)=>this.props.onChangeVista(vista, this.props.producto)} 
                        campania={this.props.campania}/>
                </div>
            </div>
        )
    }
}