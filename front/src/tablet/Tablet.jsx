import React, { Component } from "react";
import {MdOutlineRadioButtonUnchecked} from "react-icons/md"
import "./tablet.css"

import Principal from "./principal/Principal";
import VistaProducto from "./vista-producto/VistaProducto.jsx";
import CarruselRecetas from "./carrusel-recetas/CarruselRecetas";
import QrPopUp from "./qr-popup/QrPopUp";
import { Producto } from "../models/Models";
 
export default class Tablet extends Component{
    constructor(props){
        super(props);
        this.handleChangeVista=this.handleChangeVista.bind(this);
        this.state ={
            vista: 1,
            props: {
                campania: this.props.campania,
                onSelectProduct:(producto)=>this.handleChangeVista(2, producto)
            },
            showPopUp: false,
            actualQrPopUp: "",
            producto: new Producto()
        }
    }
    handleChangeVista(vista, info){
        if(vista < 4){
                this.setState({
                    vista: vista,
                    producto: info
                })
            this.props.setActualItem(info)
            // console.log("send actual: ", info);
        }
        switch(vista){
            case 4:{
                this.setState({actualQrPopUp: this.props.campania?.imgQrChat, showPopUp: true});
                break;
            }
            case 5:{
                this.setState({actualQrPopUp: this.props.campania?.imgQrPromo, showPopUp:true});
                break;
            }
            default:{
                break;
            }
        }
    }
    shouldComponentUpdate(nextProps){
        // console.log("try to update: ", nextProps, "before: ", this.props);
        if(nextProps.onGoHome !== this.props.onGoHome){
            // this.handleChangeVista(1);
            // console.log("goHome");
            return true;
        }
        if(nextProps.actualItem===undefined) {
            // console.log("not change view");
            // console.log("try to update: ", nextProps, "before: ", this.props);
            return true;
        }
        if( 
           ( !nextProps.actualItem.equals(this.props.actualItem) )) {
            const {actualItem} = nextProps;
            const isProduct = actualItem?.constructor?.name =="Producto";
            // console.log("Change props: ", nextProps, this.props)
            // this.handleChangeVista(isProduct?2:3, actualItem);
        }
        return true
    }
    render() {
    //    console.log("tablet recived:", this.props.campania);
        return (
            <div className="d-flex h-complete mt-3 vista-tablet align-items-center relat">
                <div className="d-flex tablet h-100 w-100 justify-content-end">
                    <div className="screen w-100 relat">
                        {
                            this.state.showPopUp?
                            <div className="view-pop-up d-absolut h-100 w-100 d-flex justify-content-center align-items-center" onClick={()=>this.setState({showPopUp:false})}>
                                    <QrPopUp
                                        src={this.state.actualQrPopUp}
                                    />
                            </div>
                            :
                            ""
                        }
                        {
                            this.state.vista ==1?
                            <Principal
                                campania= {this.props.campania}
                                onSelectProduct={this.handleChangeVista}
                                onChangeVista={this.handleChangeVista}
                                producto={this.state.producto}
                            />
                            :
                            ""}
                            {
                            this.state.vista ==2?
                            <VistaProducto
                                campania= {this.props.campania}
                                onSelectProduct={this.handleChangeVista}
                                onChangeVista={this.handleChangeVista}
                                producto={this.state.producto}
                                />
                                :
                                ""}
                            {
                                this.state.vista ==3?
                                <CarruselRecetas
                                campania= {this.props.campania}
                                onSelectRecip={this.props.setActualItem}
                                onChangeVista={this.handleChangeVista}
                                recetas={this.props.campania?.recetas}
                                producto={this.state.producto}
                            />
                            :
                            ""
                    }
                    </div>
                    <div className="barra-tablet  p-2 h-100 d-flex justify-content-center align-items-center">
                        <MdOutlineRadioButtonUnchecked size="30px"/>
                    </div>
                </div>
            </div>
        )
    }
}