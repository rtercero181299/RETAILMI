import React, { Component } from "react";
import { Accordion, Col, Row } from "react-bootstrap";
import { AiOutlineArrowRight, AiTwotoneEdit, AiOutlineAppstoreAdd } from "react-icons/ai"
import "./menu-lateral.css"
export default class MenuLateral extends Component {
    constructor(props) {
        super(props)
        this.handleClickProducto = this.handleClickProducto.bind(this);
    }
    handleClickProducto(producto) {
        if (this.props.selectProducto) {
            this.props.selectProducto(producto)
        } else {
            // console.log("producto elegido: ", producto);
        }
    }
    render() {
        return (
            <div className="menu-lateral">
                <Accordion color={"#000000"}>
                    <Accordion.Header
                        color="#000000"
                    >
                        <Col
                            sm="10"
                        >
                            <p className="h4 text-center w-100">
                                EXPERIENCIAS
                            </p>
                        </Col>
                        <Col
                            sm="2"
                            className="d-flex justify-content-end"
                        >
                            <a className="btn"
                                onClick={(event) => {
                                    this.props.onEditItem("Campania", null, true);
                                    event.stopPropagation();
                                }}
                            >
                                <AiOutlineAppstoreAdd
                                    title="Crear experiencia"
                                    size="1.5em"
                                />
                            </a>
                        </Col>
                    </Accordion.Header>
                    <Accordion.Body>
                        <Row
                            className="pointer element-submenu"
                            onClick={(event) => {
                                this.props.onEditItem("Campania", null, true);
                                event.stopPropagation();
                            }}
                        >
                            <Col
                                sm="2"
                                className="d-flex justify-content-end"
                            >
                                <AiOutlineAppstoreAdd
                                    title="Crear experiencia"
                                    size="1.5em"
                                />
                            </Col>
                            <Col
                                sm="10"
                            >
                                <p className="h5" >
                                    CREAR
                                </p>
                            </Col>
                        </Row>
                        <Accordion color={"#000000"}>
                            <Accordion.Header
                                color="#000000"
                            >
                                <Row>

                                    <Col
                                        sm="4"
                                        className="d-flex justify-content-start"
                                    >
                                        <AiTwotoneEdit
                                            title="Editar experiencia"
                                            size="1.5em"
                                        />
                                    </Col>
                                    <Col
                                        sm="8"
                                    >
                                        <p
                                            className="h5 text-center w-100">
                                            EDITAR
                                        </p>
                                    </Col>
                                </Row>
                            </Accordion.Header>
                            <Accordion.Body>
                                {this.props.campanias?.map((campania, index) => {
                                    return (
                                        <Accordion color={"#000000"} key={index} defaultActiveKey={index}>
                                            <Accordion.Header
                                                color="#000000"
                                                onClick={() => this.props.onSelectCampain(campania)}
                                            >
                                                <Row
                                                    className="item-product w-100"
                                                >
                                                    <Col
                                                        sm="9"
                                                    >
                                                        <p className="h3" >
                                                            {campania.nombre}
                                                        </p>
                                                    </Col>
                                                    <Col
                                                        sm="3"
                                                        className="d-flex justify-content-end"
                                                    >
                                                        <a className="btn"
                                                            onClick={(event) => {
                                                                event.preventDefault();
                                                                event.stopPropagation();
                                                                this.props.onChangeGoHome();
                                                                this.props.onSelectCampain(campania);
                                                            }}
                                                        >
                                                            <AiOutlineArrowRight
                                                                title="Visualizar experiencia"
                                                                size="1.3em"
                                                            />
                                                        </a>
                                                        <a className="btn"
                                                            onClick={(event) => {
                                                                this.props.onEditItem("Campania", campania);
                                                                console.log("campania: ", campania)
                                                                event.stopPropagation();
                                                            }}
                                                        >
                                                            <AiTwotoneEdit
                                                                title="Editar experiencia"
                                                                size="1.3em"
                                                            />
                                                        </a>
                                                    </Col>
                                                </Row>
                                            </Accordion.Header>
                                            <Accordion.Body>
                                                <Row>
                                                    <Col
                                                        sm="10"
                                                    >
                                                        <p className="h4 text-center w-100">
                                                            PRODUCTOS
                                                        </p>
                                                    </Col>
                                                    <Col
                                                        sm="2"
                                                        className="d-flex justify-content-end"
                                                    >
                                                        <a className="btn"
                                                            onClick={(event) => {
                                                                this.props.onEditItem("Producto");
                                                                event.stopPropagation();
                                                            }}
                                                        >
                                                            <AiOutlineAppstoreAdd
                                                                title="Crear Producto"
                                                                size="1.5em"
                                                            />
                                                        </a>
                                                    </Col>
                                                </Row>
                                                {
                                                    campania.productos?.map((producto, indexProducto) => {
                                                        return (
                                                            <Row
                                                                className={`item-product
                                                ${this.props.actualItem?.equals(producto) ?
                                                                        "selected" :
                                                                        ""} `}
                                                                key={indexProducto}
                                                            >
                                                                <Col
                                                                    sm="8"

                                                                >
                                                                    <p className="btn w-100"

                                                                    >
                                                                        {producto.nombre}
                                                                    </p>
                                                                </Col>
                                                                <Col
                                                                    sm="4"
                                                                    className="d-flex justify-content-end"
                                                                >
                                                                    <a className="btn"
                                                                        onClick={() => this.props.setActualItem(producto)}
                                                                    >
                                                                        <AiOutlineArrowRight
                                                                            title="Visualizar producto"
                                                                            size="1.5em"
                                                                        />
                                                                    </a>
                                                                    <a className="btn"
                                                                        onClick={(event) => {
                                                                            this.props.onEditItem("Producto", producto);
                                                                            console.log("producto: ", producto)
                                                                            event.stopPropagation();
                                                                        }}
                                                                    >
                                                                        <AiTwotoneEdit
                                                                            title="Editar producto"
                                                                            size="1.5em"
                                                                        />
                                                                    </a>
                                                                </Col>
                                                            </Row>
                                                        )
                                                    })
                                                }
                                                <Row>
                                                    <Col
                                                        sm="10"
                                                    >
                                                        <p className="h4 text-center w-100">
                                                            RECETAS
                                                        </p>
                                                    </Col>
                                                    <Col
                                                        sm="2"
                                                        className="d-flex justify-content-end"
                                                    >
                                                        <a className="btn"
                                                            onClick={(event) => {
                                                                this.props.onEditItem("Receta");
                                                                event.stopPropagation();
                                                            }}
                                                        >
                                                            <AiOutlineAppstoreAdd
                                                                title="Crear Receta"
                                                                size="1.5em"
                                                            />
                                                        </a>
                                                    </Col>
                                                </Row>
                                                {
                                                    campania.recetas?.map((receta, indexReceta) => {
                                                        return (
                                                            <Row
                                                                className={`item 
                                                ${this.props.actualItem?.equals(receta) ?
                                                                        "selected" :
                                                                        ""} `}
                                                                key={indexReceta}
                                                            >
                                                                <Col
                                                                    sm="8"
                                                                >
                                                                    <p className="btn w-100"
                                                                        onClick={() => this.props.setActualItem(receta)}
                                                                    >
                                                                        {receta.nombre}
                                                                    </p>
                                                                </Col>
                                                                <Col
                                                                    sm="4"
                                                                    className="d-flex justify-content-end"
                                                                >
                                                                    <a className="btn"
                                                                        onClick={() => this.props.setActualItem(receta)}
                                                                    >
                                                                        <AiOutlineArrowRight
                                                                            title="Visualizar Receta"
                                                                            size="1.5em"
                                                                        />
                                                                    </a>
                                                                    <a className="btn"
                                                                        onClick={(event) => {
                                                                            this.props.onEditItem("Receta", receta);
                                                                            console.log("receta: ", receta)
                                                                            event.stopPropagation();
                                                                        }}
                                                                    >
                                                                        <AiTwotoneEdit
                                                                            title="Editar receta"
                                                                            size="1.5em"
                                                                        />
                                                                    </a>
                                                                </Col>
                                                            </Row>
                                                        )
                                                    })
                                                }
                                            </Accordion.Body>
                                        </Accordion>
                                    )
                                })}
                            </Accordion.Body>
                        </Accordion>
                    </Accordion.Body>
                </Accordion>
            </div>
        )
    }
}