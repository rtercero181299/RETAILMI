/**
 * Modulos
 */
import React, { Component } from "react";
import { Col, FloatingLabel, Form, FormGroup, Row, Image,Alert, Button  } from "react-bootstrap";
import { AiOutlineCloseCircle, AiOutlineCheckCircle } from "react-icons/ai";
/**
 * Constantes
 */
import { API } from "../enviroment/Credentials";
/**
 * Estilos
 */
import "./form-campania.css";
export default class FormCampania extends Component {
    constructor(props) {
        super(props);
        const campania = this.props.item;
        this.state = {
            id: campania?.id || 0,
            nombre: campania?.nombre || "",
            colorFondo: campania?.colorFondo || "#000000",
            imgPresentacion: campania?.imgPresentacion || "",
            imgBotonScanner: campania?.imgBotonScanner || "",
            imgQrChat: campania?.imgQrChat || "",
            imgQrPromo: campania?.imgQrPromo || "",
            imgBtnOpen: campania?.imgBtnOpen || "",
            imgBtnClose: campania?.imgBtnClose || "",
            imgBtnRecetas: campania?.imgBtnRecetas || "",
            imgBtnChatBot: campania?.imgBtnChatBot || "",
            imgBtnPromocion: campania?.imgBtnPromocion || "",
            sending: false,
            colorAlert: "success",
            showAlert: false,
            alertMessage: ""
        }
        this.handleChangeNombre = this.handleChangeNombre.bind(this);
        this.handleChangeImgPresentacion = this.handleChangeImgPresentacion.bind(this);
        this.handleChangeColorFondo = this.handleChangeColorFondo.bind(this);
        this.handleChangeImgBotonScanner = this.handleChangeImgBotonScanner.bind(this)
        this.handleChangeImgQrChat = this.handleChangeImgQrChat.bind(this);
        this.handleChangeImgQrPromo = this.handleChangeImgQrPromo.bind(this);
        this.handleChangeImgBtnOpen = this.handleChangeImgBtnOpen.bind(this);
        this.handleChangeImgBtnClose = this.handleChangeImgBtnClose.bind(this);
        this.handleChangeImgBtnRecetas = this.handleChangeImgBtnRecetas.bind(this);
        this.handleChangeImgBtnChatBot = this.handleChangeImgBtnChatBot.bind(this);
        this.handleChangeImgBtnPromocion = this.handleChangeImgBtnPromocion.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this)
    }
    handleChangeNombre({ target }) {
        const { value } = target;
        this.setState({ nombre: value })
    }

    handleChangeColorFondo({ target }) {
        const { value } = target;
        this.setState({ colorFondo: value })
    }

    handleChangeImgPresentacion({ target }) {
        if (target.files && target.files[0]) {
            const { files } = target
            this.setState({ imgPresentacion: files[0] })
        }
    }
    handleChangeImgBotonScanner({ target }) {
        if (target.files && target.files[0]) {
            const { files } = target
            console.log("file scanner: ", files[0]);
            this.setState({ imgBotonScanner: files[0] })
        } else {
            console.log("notFiles");
        }
    }
    handleChangeImgQrChat({ target }) {
        if (target.files && target.files[0]) {
            const { files } = target
            this.setState({ imgQrChat: files[0] })
        }
    }
    handleChangeImgQrPromo({ target }) {
        if (target.files && target.files[0]) {
            const { files } = target
            this.setState({ imgQrPromo: files[0] })
        }
    }
    handleChangeImgBtnOpen({ target }) {
        if (target.files && target.files[0]) {
            const { files } = target
            this.setState({ imgBtnOpen: files[0] })
        }
    }
    handleChangeImgBtnClose({ target }) {
        if (target.files && target.files[0]) {
            const { files } = target
            this.setState({ imgBtnClose: files[0] })
        }
    }
    handleChangeImgBtnRecetas({ target }) {
        if (target.files && target.files[0]) {
            const { files } = target
            this.setState({ imgBtnRecetas: files[0] })
        }
    }
    handleChangeImgBtnChatBot({ target }) {
        if (target.files && target.files[0]) {
            const { files } = target
            this.setState({ imgBtnChatBot: files[0] })
        }
    }
    handleChangeImgBtnPromocion({ target }) {
        if (target.files && target.files[0]) {
            const { files } = target
            this.setState({ imgBtnPromocion: files[0] })
        }
    }
    async handleSubmit() {
        const form = new FormData();
        const {
            id
            , nombre
            , colorFondo
            , imgPresentacion
            , imgBotonScanner
            , imgQrChat
            , imgQrPromo
            , imgBtnOpen
            , imgBtnClose
            , imgBtnRecetas
            , imgBtnChatBot
            , imgBtnPromocion
        } = this.state
        if (nombre == "") {
            this.setState({
                alertMessage: "Debes ingresar al menos un nombre",
                colorAlert: "danger",
                showAlert: true
            })
            return;
        }
        form.append("id", id);
        form.append("nombre", nombre);
        form.append("colorFondo", colorFondo);
        form.append("idUsuario", this.props.id);
        if (typeof imgPresentacion == "string") {   
            form.append("imgPresentacion", imgPresentacion);
        } else {
            form.append("imgPresentacion", imgPresentacion, (Date.now()).toString() + imgPresentacion.name);
        }
        if (typeof imgBotonScanner == "string") {
            form.append("imgBotonScanner", imgBotonScanner);
        } else {
            form.append("imgBotonScanner", imgBotonScanner, (Date.now() + 1).toString() + imgBotonScanner.name);
        }
        if (typeof imgQrChat == "string") {
            form.append("imgQrChat", imgQrChat);
        } else {
            form.append("imgQrChat", imgQrChat, (Date.now() + 2).toString() + imgQrChat.name);
        }
        if (typeof imgQrPromo == "string") {
            form.append("imgQrPromo", imgQrPromo);
        } else {
            form.append("imgQrPromo", imgQrPromo, (Date.now() + 3).toString() + imgQrPromo.name);
        }
        if (typeof imgBtnOpen == "string") {
            form.append("imgBtnOpen", imgBtnOpen);
        } else {
            form.append("imgBtnOpen", imgBtnOpen, (Date.now() + 4).toString() + imgBtnOpen.name);
        }
        if (typeof imgBtnClose == "string") {
            form.append("imgBtnClose", imgBtnClose);
        } else {
            form.append("imgBtnClose", imgBtnClose, (Date.now() + 5).toString() + imgBtnClose.name);
        }
        if (typeof imgBtnRecetas == "string") {
            form.append("imgBtnRecetas", imgBtnRecetas);
        } else {
            form.append("imgBtnRecetas", imgBtnRecetas, (Date.now() + 6).toString() + imgBtnRecetas.name);
        }
        if (typeof imgBtnChatBot == "string") {
            form.append("imgBtnChatBot", imgBtnChatBot);
        } else {
            form.append("imgBtnChatBot", imgBtnChatBot, (Date.now() + 7).toString() + imgBtnChatBot.name);
        }
        if (typeof imgBtnPromocion == "string") {
            form.append("imgBtnPromocion", imgBtnPromocion);
        } else {
            form.append("imgBtnPromocion", imgBtnPromocion, (Date.now() + 8).toString() + imgBtnPromocion.name);
        }
        const options = {
            method: "POST",
            mode: "cors",
            body: form
        }
        const webService= this.props.item? API.MODIFY_EXPERIENCIA: API.REGISTER_EXPERIENCIA;
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
                            alertMessage: `se ${this.props.item ? "modificó" : "registró"} la experiencia correctamente`,
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
                            alertMessage: "Ya existe una experiencia registrada con ese nombre, por favor elige otro",
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
            <Form className="form auto-scroll h-100 p-relative">
                <div className="alert-container">
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
                <Row className="">
                    <h1 className="h3 text-center mb-4">{this.props.item ? "Editar" : "Crear"} campaña</h1>
                    <Col
                        sm={12}
                        md={12}
                        lg={6}
                        xl={6}
                    >
                        <FloatingLabel
                            controlId={'floatingInputNombre'}
                            label="Nombre de la campaña"
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
                        <FormGroup
                            className="mb-4"
                        >
                            <Form.Label>Color de fondo</Form.Label>
                            <Form.Control
                                type="color"
                                onChange={this.handleChangeColorFondo}
                                value={this.state.colorFondo}
                            />
                        </FormGroup>
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
                            className="mb-4"
                        >
                            <Form.Label>Imagen de presentación</Form.Label>
                            <div className="img-preview w-100 d-flex justify-content-center align-items-center">
                                {this.state.imgPresentacion.name?.length > 0 || this.state.imgPresentacion?.length > 0 ?
                                    <Image
                                        height="100%"
                                        width="100%"
                                        src={typeof this.state.imgPresentacion == "string" ?
                                            this.state.imgPresentacion :
                                            URL.createObjectURL(this.state.imgPresentacion)}
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
                            className="mb-4"
                        >
                            <Form.Label>Imagen del botón del scanner</Form.Label>
                            <div className="img-preview w-100 d-flex justify-content-center align-items-center">
                                {this.state.imgBotonScanner.name?.length > 0 || this.state.imgBotonScanner?.length > 0 ?
                                    <Image
                                        height="100%"
                                        width="100%"
                                        src={typeof this.state.imgBotonScanner == "string" ?
                                            this.state.imgBotonScanner :
                                            URL.createObjectURL(this.state.imgBotonScanner)}
                                        className="prev-scanner"
                                    />
                                    :
                                    <p className="text-center">No se ha seleccionado una imagen</p>
                                }
                            </div>
                            <Form.Control
                                type="file"
                                accept={'image/*'}
                                onChange={this.handleChangeImgBotonScanner}
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
                            className="mb-4"
                        >
                            <Form.Label>Imagen del QR del ChatBot</Form.Label>
                            <div className="img-preview w-100 d-flex justify-content-center align-items-center">
                                {this.state.imgQrChat.name?.length > 0 || this.state.imgQrChat?.length > 0 ?

                                    <Image
                                        height="100%"
                                        width="100%"
                                        src={typeof this.state.imgQrChat == "string" ?
                                            this.state.imgQrChat :
                                            URL.createObjectURL(this.state.imgQrChat)}
                                        className="prev-qr"
                                    />
                                    :
                                    <p className="text-center">No se ha seleccionado una imagen</p>
                                }
                            </div>
                            <Form.Control
                                type="file"
                                accept={'image/*'}
                                onChange={this.handleChangeImgQrChat}
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
                            className="mb-4"
                        >
                            <Form.Label>Imagen del QR de la promo</Form.Label>
                            <div className="img-preview w-100 d-flex justify-content-center align-items-center">
                                {this.state.imgQrPromo.name?.length > 0 || this.state.imgQrPromo?.length > 0 ?
                                    <Image
                                        height="100%"
                                        width="100%"
                                        src={typeof this.state.imgQrPromo == "string" ?
                                            this.state.imgQrPromo :
                                            URL.createObjectURL(this.state.imgQrPromo)}
                                        className="prev-qr"
                                    />

                                    :
                                    <p className="text-center">No se ha seleccionado una imagen</p>
                                }
                            </div>
                            <Form.Control
                                type="file"
                                accept={'image/*'}
                                onChange={this.handleChangeImgQrPromo}
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
                            className="mb-4"
                        >
                            <Form.Label>Imagen del botón para abrir el menú desplegable</Form.Label>
                            <div className="img-preview w-100 d-flex justify-content-center align-items-center">
                                {this.state.imgBtnOpen.name?.length > 0 || this.state.imgBtnOpen?.length > 0 ?
                                    <Image
                                        height="100%"
                                        width="100%"
                                        src={typeof this.state.imgBtnOpen == "string" ?
                                            this.state.imgBtnOpen :
                                            URL.createObjectURL(this.state.imgBtnOpen)}
                                        className="prev-btn-menu"
                                    />

                                    :
                                    <p className="text-center">No se ha seleccionado una imagen</p>
                                }
                            </div>
                            <Form.Control
                                type="file"
                                accept={'image/*'}
                                onChange={this.handleChangeImgBtnOpen}
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
                            className="mb-4"
                        >
                            <Form.Label>Imagen del botón para ocultar del menú desplegable</Form.Label>
                            <div className="img-preview w-100 d-flex justify-content-center align-items-center">
                                {this.state.imgBtnClose.name?.length > 0 || this.state.imgBtnClose?.length > 0 ?
                                    <Image
                                        height="100%"
                                        width="100%"
                                        src={typeof this.state.imgBtnClose == "string" ?
                                            this.state.imgBtnClose :
                                            URL.createObjectURL(this.state.imgBtnClose)}
                                        className="prev-btn-menu"
                                    />

                                    :
                                    <p className="text-center">No se ha seleccionado una imagen</p>
                                }
                            </div>
                            <Form.Control
                                type="file"
                                accept={'image/*'}
                                onChange={this.handleChangeImgBtnClose}
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
                            className="mb-4"
                        >
                            <Form.Label>Imagen del botón de recetas del menú desplegable</Form.Label>
                            <div className="img-preview w-100 d-flex justify-content-center align-items-center">
                                {this.state.imgBtnRecetas.name?.length > 0 || this.state.imgBtnRecetas?.length > 0 ?
                                    <Image
                                        height="100%"
                                        width="100%"
                                        src={typeof this.state.imgBtnRecetas == "string" ?
                                            this.state.imgBtnRecetas :
                                            URL.createObjectURL(this.state.imgBtnRecetas)}
                                        className="prev-btn-menu"
                                    />

                                    :
                                    <p className="text-center">No se ha seleccionado una imagen</p>
                                }
                            </div>
                            <Form.Control
                                type="file"
                                accept={'image/*'}
                                onChange={this.handleChangeImgBtnRecetas}
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
                            className="mb-4"
                        >
                            <Form.Label>Imagen del botón del chat-bot del menú desplegable</Form.Label>
                            <div className="img-preview w-100 d-flex justify-content-center align-items-center">
                                {this.state.imgBtnChatBot.name?.length > 0 || this.state.imgBtnChatBot?.length > 0 ?
                                    <Image
                                        height="100%"
                                        width="100%"
                                        src={typeof this.state.imgBtnChatBot == "string" ?
                                            this.state.imgBtnChatBot :
                                            URL.createObjectURL(this.state.imgBtnChatBot)}
                                        className="prev-btn-menu"
                                    />

                                    :
                                    <p className="text-center">No se ha seleccionado una imagen</p>
                                }
                            </div>
                            <Form.Control
                                type="file"
                                accept={'image/*'}
                                onChange={this.handleChangeImgBtnChatBot}
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
                            className="mb-4"
                        >
                            <Form.Label>Imagen del botón de promoción del menú desplegable</Form.Label>
                            <div className="img-preview w-100 d-flex justify-content-center align-items-center">
                                {this.state.imgBtnPromocion.name?.length > 0 || this.state.imgBtnPromocion?.length > 0 ?
                                    <Image
                                        height="100%"
                                        width="100%"
                                        src={typeof this.state.imgBtnPromocion == "string" ?
                                            this.state.imgBtnPromocion :
                                            URL.createObjectURL(this.state.imgBtnPromocion)}
                                        className="prev-btn-menu"
                                    />
                                    :
                                    <p className="text-center">No se ha seleccionado una imagen</p>
                                }
                            </div>
                            <Form.Control
                                type="file"
                                accept={'image/*'}
                                onChange={this.handleChangeImgBtnPromocion}
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