import React, { Component } from "react";



import CarrouselItems from "../carrousel-items/CarrouselItems";
import CampaniaPresentation from "./campania-presentation/CampaniaPresentation";

export default class Principal extends Component{
    constructor(props){
        super(props)
    }
    render() {
        // console.log("principal recived: ", this.props.campania)
        return (
            <div className="w-100 h-100 d-flex">
                <div className="w-75 presentation-size h-100">
                        <CampaniaPresentation 
                            campania ={this.props.campania}
                            onClickEscaner ={this.props.onClickEscaner}
                            />
                    </div>  
                    <div className="carrusel-space w-25 h-100">
                        <CarrouselItems 
                            items={this.props.campania?.productos}
                            campania ={this.props.campania}
                            onSelectItem={this.props.onSelectProduct}
                            />
                    </div>
            </div>
        )
    }
}