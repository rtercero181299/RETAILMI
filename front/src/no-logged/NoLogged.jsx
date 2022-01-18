import React, { Component } from "react";
import { Container } from "react-bootstrap";
import { Link } from "react-router-dom";

export default class NoLogged extends Component{
    constructor(props){
        super(props)
    }
    render(){
        return(
            <Container>
                 <div className="text-center h-100">
                    <h1 className="mt-5">¡Aún no estas loggeado!</h1>
                    <p>Debes estar loggeado para poder interactuar</p>
                    <p>Inicia sesión dando click en Iniciar sesión, o da click <Link to="/login">aqui</Link></p>
                </div>   
            </Container>
        )
    }
}