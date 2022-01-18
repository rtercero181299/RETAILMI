import React, { Component } from "react";
import { Col, FloatingLabel, Form, FormGroup, Row, Image, Alert, Button } from "react-bootstrap";
import { AiOutlineCloseCircle, AiOutlineCheckCircle } from "react-icons/ai";
import { API } from "../enviroment/Credentials";
import "./form-product.css";

export default class FormProduct extends Component {
    constructor(props) {
        super(props);
        const producto = this.props.item;
        this.state = {
            nombre: producto?.nombre || "",
            codigoBarras: producto?.codigoBarras || "",
            imgPresentacion: producto?.imgPresentacion ?? "",
            videoPromo: producto?.videoPromo || "",
            sending: false,
            colorAlert: "success",
            showAlert: false,
            alertMessage: ""
        }
        this.handleChangeNombre = this.handleChangeNombre.bind(this);
        this.handleChangeCodigoBarras = this.handleChangeCodigoBarras.bind(this);
        this.handleChangeImgPresentacion = this.handleChangeImgPresentacion.bind(this);
        this.handleChangeVideoPromo = this.handleChangeVideoPromo.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        
    }
    handleChangeNombre({ target }) {
        const { value } = target;
        this.setState({ nombre: value })
    }
    handleChangeCodigoBarras({ target }) {
        const { value } = target;
        this.setState({ codigoBarras: value })
    }
    handleChangeImgPresentacion({ target }) {
        const value = target.files[0];
        this.setState({ imgPresentacion: value })
    }
    handleChangeVideoPromo({ target }) {
        const value = target.files[0];
        this.setState({ videoPromo: value })
    }
    async handleSubmit(){
        const{
                id
                ,nombre
                ,codigoBarras
                ,imgPresentacion
                ,videoPromo
        } = this.state;
        if (nombre == "") {
            this.setState({
                alertMessage: "Debes ingresar al menos un nombre",
                colorAlert: "danger",
                showAlert: true
            })
            return;
        }
        const form = new FormData();
        form.append("id", id);
        form.append("nombre", nombre);
        form.append("idUsuario", this.props.id);
        form.append("codigoBarras", codigoBarras);
        if (typeof imgPresentacion == "string") {   
            form.append("imgPresentacion", imgPresentacion);
        } else {
            form.append("imgPresentacion", imgPresentacion, (Date.now()).toString() + imgPresentacion.name);
        }
        if (typeof videoPromo == "string") {   
            form.append("videoPromo", videoPromo);
        } else {
            form.append("videoPromo", videoPromo, (Date.now()+1).toString() + videoPromo.name);
        }
        const options = {
            method: "POST",
            mode: "cors",
            body: form
        }
        const webService= this.props.item? API.MODIFY_PRODUCT: API.REGISTER_PRODUCT;
        const resp = await fetch(webService, options).
            catch(error => {
                this.setState({
                    alertMessage: "Ocurrrió un error al realizar el registro",
                    colorAlert: "danger",
                    showAlert: true
                })
                console.error("error al hacer el registro: ", error);
            });
        if (resp) {
            const data = await resp.json().catch(error => {
                this.setState({
                    alertMessage: "Ocurrrió un error al realizar el registro",
                    colorAlert: "danger",
                    showAlert: true
                })
                console.error("error al obtener la información del registro: ", error);
            });
            if (data) {
                switch (data.result) {
                    case 'correcto':
                        this.setState({
                            alertMessage: `se ${this.props.item ? "modificó" : "registró"} el producto correctamente`,
                            colorAlert: "success", 
                            showAlert: true
                        });
                        this.props.updateExperiences();
                        setTimeout(() => {
                            this.props.onClose();
                        }, 3000);
                        return;
                    case 'error':
                        this.setState({
                            alertMessage: "Ocurrio un error",
                            colorAlert: "danger"
                        });
                        break;
                    case 'error-several-clicks':
                        this.setState({
                            alertMessage: "Se intentó demaciadas veces",
                            colorAlert: "danger"
                        });
                        break;
                    case "user-exist":
                        this.setState({
                            alertMessage: "Ya existe un producto registrado con ese nombre, por favor elige otro",
                            colorAlert: "info"
                        })
                        break;
                    default:
                        break;
                }
                this.setState({ sending: false, showAlert: true });
            }
        }
    }
    render() {
        return (
            <Form className="form auto-scroll"><div className="alert-container">
                <div className="alert-size">
                    {this.state.showAlert ?
                        <Alert
                            variant={this.state.colorAlert}
                            onClose={() => {
                                this.setState({ showAlert: false })
                                if (this.state.colorAlert == "success")
                                    this.props.onClose()
                            }}
                            dismissible
                        >
                            <Alert.Heading
                                as="h5"
                                className="text-center"
                            >
                                {this.state.alertMessage?.toUpperCase()}
                            </Alert.Heading>
                        </Alert>
                        :
                        ""
                    }
                </div>
            </div>
                <a
                    className="d-absolut btn-close-form btn-ok pointer"
                    onClick={this.handleSubmit}
                >
                    <AiOutlineCheckCircle
                        size={30} />
                </a>
                <a
                    className="d-absolut btn-close-form pointer"
                    onClick={this.props.onClose}
                >
                    <AiOutlineCloseCircle size={30} />
                </a>
                <Row>
                    <h1 className="h3 text-center mb-4">{this.props.item ? "Editar" : "Crear"} producto</h1>
                    <Col
                        sm={12}
                        md={12}
                        lg={6}
                        xl={6}
                    >
                        <FloatingLabel
                            controlId={'floatingInputNombre'}
                            label="Nombre del producto"
                            className="mb-4"
                        >
                            <Form.Control
                                type="text"
                                onChange={this.handleChangeNombre}
                                value={this.state.nombre}
                                placeholder="Nombre del producto"
                            />
                        </FloatingLabel>
                    </Col>
                    <Col
                        sm={12}
                        md={12}
                        lg={6}
                        xl={6}
                    >
                        <FloatingLabel
                            controlId={'floatingInput2'}
                            label="Código de barras"
                            className="mb-4"
                        >
                            <Form.Control
                                type="text"
                                onChange={this.handleChangeCodigoBarras}
                                value={this.state.codigoBarras}
                                placeholder="Código de barras"
                            />
                        </FloatingLabel>
                    </Col>

                </Row>
                <Row>
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
                                {this.state.imgPresentacion ?
                                    <Image
                                        height="100%"
                                        src={this.state.imgPresentacion}
                                        className="prev-img-presentacion"
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
                            <Form.Label>Video de presentación</Form.Label>
                            <div className="img-preview w-100 d-flex justify-content-center align-items-center">
                                {this.state.videoPromo ?
                                    <video
                                        src={this.state.videoPromo}
                                        height="100%"
                                        width="100%"
                                        controls={true}
                                    />
                                    :
                                    <p className="text-center">No se ha seleccionado un video</p>
                                }
                            </div>
                            <Form.Control
                                type="file"
                                accept={'video/*'}
                                onChange={this.handleChangeVideoPromo}
                            />
                        </FormGroup>
                    </Col>

                </Row>
                <Row>
                    <Col
                        sm={12}
                        className="h-100P"
                    >
                        <FormGroup
                            className="mb-4 d-flex justify-content-center align-items-center h-100"
                        >
                            <Button
                                variant="primary"
                                onClick={this.handleSubmit}
                            >
                                {this.props.title?.toUpperCase() || "REGISTRAR"}
                            </Button>
                        </FormGroup>
                    </Col>

                </Row>
            </Form>
        )
    }
}