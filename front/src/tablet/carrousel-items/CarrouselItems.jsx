import React, { Component } from "react";
import { Carousel, Image } from "react-bootstrap";
import dfuser from "../../assets/img/df-user.png"

import "./carrousel-items.css"
export default class CarrouselItems extends Component{
    constructor(props){
        super(props);
    }
    render() {
        // console.log("carrusel items recived: ", this.props.items);
        return (
            <div className="carrousel-productos w-100 h-100">
                <Carousel className=" h-100 justify-content-center d-flex" variant="dark" indicators={false}>
                    {
                        this.props.items?
                        this.props.items.map((item, index)=>{
                            const {imgPresentacion, nombre} = item;
                            // console.log("item: ", item);
                            return( 
                                <Carousel.Item 
                                        key={index} 
                                        onClick={()=>this.props.onSelectItem(2,item)} 
                                        className="h-100 justify-content-end">
                                    <div className="item h-100">
                                        <Image width="100%" height="100%" alt={"no se puede cargr la imagen de presentación del producto "+nombre} src={imgPresentacion}/>
                                    </div>
                                </Carousel.Item>
                            )
                        })
                        :
                        <Carousel.Item className="h-100">
                        <div className="producto h-100">
                            <img src={dfuser} alt="default" height={"100%"} width={"100%"} index={0} onClick={()=>this.props.onSelectItem(2, undefined)}/>
                        </div>
                        </Carousel.Item>
                    }
                </Carousel>
            </div>
        )
    }
}