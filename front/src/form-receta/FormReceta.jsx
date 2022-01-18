import React, { Component } from "react";
import { Col, FloatingLabel, Form, FormGroup, Row, Image } from "react-bootstrap";
import {AiOutlineCloseCircle} from "react-icons/ai";
import "./form-receta.css";
export default class FormReceta extends Component{
    constructor(props){
        super(props);
        const receta = this.props.item;
        this.state={
            nombre: receta?.nombre||"",
            imgPresentacion: receta?.imgPresentacion|| "",
        }
        this.handleChangeNombre = this.handleChangeNombre.bind(this);
        this.handleChangeImgPresentacion = this.handleChangeImgPresentacion.bind(this)
    }
    handleChangeNombre(event){
        const value = event.target.value;
        this.setState({nombre: value})
    }
    handleChangeImgPresentacion(event){
        const value = event.target.files[0];
        this.setState({imgPresentacion: value})
    }
    render() {
        return (
            <Form className="form auto-scroll">
                <Row className="relat">
                <h1 className="h3 text-center mb-4">{this.props.item?"Editar":"Crear"} receta</h1>
                    <a 
                    className="btn d-absolut btn-close" 
                    onClick={this.props.onClose}
                    >
                        <AiOutlineCloseCircle size={5}/>
                    </a>
                    <Col
                        sm={12}
                        md={12}
                        lg={6}
                        xl={6}
                    >   
                        <FloatingLabel
                            controlId={'floatingInputNombre'}
                            label="Nombre de la receta"
                            className="mb-4"
                            >
                            <Form.Control 
                                type="text" 
                                onChange={this.handleChangeNombre}
                                value={this.state.nombre}
                                placeholder="Nombre de la receta"
                                />
                        </FloatingLabel>
                    </Col>
                    <Col
                        sm={12}
                        md={12}
                        lg={6}
                        xl={6}
                    >   
                        <FormGroup
                            controlId={'floatingInput'}
                            className="mb-4"
                            >
                            <Form.Label>Imagen de presentación</Form.Label>
                            <div className="img-preview w-100 d-flex justify-content-center align-items-center">
                                {this.state.imgPresentacion?
                                <Image
                                height="100%"
                                width="100%"
                                alt={`No se puede cargar la imagen de presentación`}
                                src={this.state.imgPresentacion}
                                />
                                :
                                <p className="text-center">No se ha seleccionado una imagen</p>
                                }
                            </div>
                            <Form.Control 
                                type="file"
                                accept={'image/*'} 
                                onChange={this.handleChangeImgPresentacion}
                                />
                        </FormGroup>
                    </Col>

                </Row>
            </Form>
        )
    }
}