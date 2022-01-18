/**
 * Modulos
 */
import React, { Component } from "react";
import {
    Row,
    Col
} from "react-bootstrap";

/**
 * Componenetes
 */
import ErrorPage from "../error-page/ErrorPage";
import FormReceta from "../form-receta/FormReceta";
import FormCampania from "../form-campania/FormCampania";
import FormProduct from "../form-product/FormProduct";
import NoLogged from "../no-logged/NoLogged";
import Tablet from "../tablet/Tablet";
import MenuLateral from "../menu-lateral/MenuLateral";
/**
 * Modelos
 */
import { Campania, campania, Producto } from "../models/Models";
/**
 * Estilos
 */
import "./home-csm.css"
import { API } from "../enviroment/Credentials";
/**
 * @author @AmelieGranados
 * @description Clase que define la vista del CSM, donde existen los ABC de Experiencias y sus Productos y Recetas
 * @argument {boolean} isLogged -- estado que define si el usuario inició sesión en el sistema
 */
export default class HomeCSM extends Component {
    constructor(props) {
        super(props)
        this.state = {
            typeForm: "Producto",
            itemEditing: undefined,
            showForm: false,
            Form: FormProduct,
            actualCampain: undefined,
            actualItem: new Producto(),
            campanias: [campania],
            productos: campania.productos,
            recetas: campania.recetas,
            goHome: true
        }
        this.handleOpenForm = this.handleOpenForm.bind(this);
        this.handleselectCampain = this.handleselectCampain.bind(this);
        this.getData = this.getData.bind(this);
    }
    componentDidMount() {
        this.getData();
    }
    handleselectCampain(campania) {
        this.setState({
            actualCampain: campania,
            productos: campania.productos,
            recetas: campania.recetas,
            showForm: false
        })
    }
    async getData() {
        const options = {
            method: "POST",
            mode: "cors",
            headers: {
                "Content-Type": "application/json"
            }
        }
        const resp = await fetch(API.LIST_ALL_EXPERIENCES, options).catch(err => {
            console.error("Error al obtener los datos");
        });
        if (resp) {
            const data = await resp.json().catch(err => {
                console.error("Error al intentar convertir los datos");
            });
            if (Array.isArray(data)) {
                const campanias = data.map(({
                    id
                    , nombre
                    , imgPresentacion
                    , imgBotonScanner
                    , colorFondo
                    , imgQrChat
                    , imgQrPromo
                    , imgBotonOpen
                    , imgBotonClose
                    , imgBotonRecetas
                    , imgBotonChatBot
                    , imgBotonPromocion
                })=>new Campania(
                    parseInt(id)
                    , nombre
                    , imgPresentacion
                    , imgBotonScanner
                    , colorFondo
                    , imgQrChat
                    , imgQrPromo
                    , imgBotonOpen
                    , imgBotonClose
                    , imgBotonRecetas
                    , imgBotonChatBot
                    , imgBotonPromocion
                ))
                this.setState({ campanias: campanias })
            }
        }


    }
    handleOpenForm(typeForm, item, isAdd = false) {
        let Form = ErrorPage;
        switch (typeForm) {
            case "Producto": {
                Form = FormProduct;
                break;
            }
            case "Receta": {
                Form = FormReceta
                break;
            }
            case "Campania": {
                if (!isAdd)
                    this.handleselectCampain(item);
                Form = FormCampania
                break;
            }
            default: {
                Form = ErrorPage;
                break;
            }
        }
        this.setState({
            typeForm: typeForm,
            itemEditing: item,
            Form: Form
        })
        this.setState({
            showForm: false,
        })
        setTimeout(() => {
            this.setState({
                showForm: true,
            })
        }, 10);
    }
    render() {
        if (!this.props.isLogged) {
            return <NoLogged />;
        }
        return (
            <div className="home">
                <Row>
                    <Col
                        sm={12}
                        md={4}
                        lg={3}
                        xl={3}
                    >
                        <MenuLateral
                            onSelectCampain={this.handleselectCampain}
                            onEditItem={this.handleOpenForm}
                            campanias={this.state.campanias}
                            actualItem={this.state.actualItem}
                            setActualItem={(item) => this.setState({ actualItem: item })}
                            onChangeGoHome={() => this.setState({ goHome: !this.state.goHome })}
                        />
                    </Col>
                    <Col
                        sm={12}
                        md={8}
                        lg={8}
                        xl={8}
                        className="relat"
                    >
                        {
                            this.state.showForm ?
                                <div className="h-100 w-100 popup-form d-flex align-items-center">
                                    <this.state.Form
                                        item={this.state.itemEditing}
                                        campania={this.state.actualCampain}
                                        onClose={() => this.setState({ showForm: false })}
                                        id={this.props.id}
                                        updateExperiences={this.getData}
                                    />
                                </div>
                                :
                                ""
                        }
                        <Tablet
                            campania={this.state.actualCampain}
                            productos={this.state.productos}
                            recetas={this.state.recetas}
                            actualItem={this.state.actualItem}
                            setActualItem={(item) => this.setState({ actualItem: item })}
                            onGoHome={this.state.goHome}
                        />
                    </Col>

                </Row>
            </div>
        )
    }
}