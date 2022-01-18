import React, { Component } from "react";
import { Carousel, Button, Image } from 'react-bootstrap';
import dfuser from "../../assets/img/df-user.png"
import "./carrusel-recetas.css"

export default class CarruselRecetas extends Component {
    constructor(props) {
        super(props)
        if (this.props.recetas){
            this.props.onSelectRecip(this.props.recetas[0])
        }
    }
    render() {
        return (
            <div className="carrusel-recetas relat w-100 h-100">
                <Carousel
                    className="w-100 h-100"
                    onSelect={(index) => {
                        console.log("recip index: ", index)
                        this.props.onSelectRecip(this.props.recetas[index])
                    }}
                >
                    {
                        this.props.recetas ?
                            this.props.recetas.map((receta, index) => {
                                const { imgPresentacion, nombre } = receta
                                return (
                                    <Carousel.Item
                                        key={index}
                                        className="h-100 justify-content-end">
                                        <div className="receta h-100">
                                            <Image width="100%" height="100%" alt={"no se puede cargr la imagen de presentación de la receta " + nombre} src={imgPresentacion} />
                                        </div>
                                    </Carousel.Item>
                                )
                            })
                            :
                            <Carousel.Item className="h-100 w-100">
                                <div className="producto h-100 w-100">
                                    <img src={dfuser} alt="default" height={"100%"} width={"100%"} />
                                </div>
                            </Carousel.Item>
                    }
                </Carousel>
                <div className="btn-salir">
                    <Button variant="danger" onClick={() => this.props.onChangeVista(2, this.props.producto)}>
                        SALIR
                    </Button>
                </div>
            </div>
        )
    }
}