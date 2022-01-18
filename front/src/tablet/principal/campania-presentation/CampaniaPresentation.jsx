import React, {Component} from "react";
import { Image } from 'react-bootstrap';    
import "./campania-presentation.css"

export default class CampaniaPresentation extends Component{
    constructor(props){
        super(props)
    }

    render() {
        // console.log("campania recived: ", this.props.campania)
        const {imgBotonScanner,  imgPresentacion} = this.props.campania ??{};
        // console.log("boton scanner: ", imgBotonScanner);
        return (
            <div className="campania-presentation w-100 h-100 d-flex justify-content-center align-items-end">
                <Image src={ imgPresentacion}  heigth="100%" width="100%" alt="No se puede cargar la imagen de presentación de la campaña"/>
                <div className={`boton-escaner ${imgBotonScanner?.lenght>0?"":"empty"} d-absolut`}>
                    <Image src={ imgBotonScanner}  heigth="100%" width="100%" alt="No se puede cargar la imagen del botón de escaner de la campaña"/>
                </div>
            </div>
        )
    }
}