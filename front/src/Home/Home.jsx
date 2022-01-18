//modulos
import React, {Component} from "react";
import { Link } from "react-router-dom";
//assets
import "./home.css";
//Componentes
import VistaSupervisor from "../vista-supervisor/VistaSupervisor.jsx";
import VistaUsuario from "../VistaUsuario/VistaUsuario.jsx";
/**
 * @author @AmelieCruz
 * Componente que define la vista principal evaluando si el usuario está loggeado
 * y si es así dependiendo del tipo de usuario despiebla una interfaz diferente
 * (no incluye la navbar)
 * @argument {boolean} isLogged -- indica si se logeó un usuario o no
 * @argument {number} tipoUsuario -- tipo de usuario que se loggeó
 * @argument {string} userName -- username del usuario que se loggeó
 * @argument {number | string} -- id del usuario que se loggeó
 * @argument {Socket} socket -- websocket conectado al server
 */
export default class Home extends Component{
    constructor(props){
        super(props);
    }
    render(){
        return(
            <div className="home d-flex flex-column align-items-center">
                {this.props.isLogged?
                    this.props.tipoUsuario == 1?
                    <VistaUsuario 
                        userName={this.props.userName}
                        id={this.props.id}
                        socket ={this.props.socket} 
                    />
                    :
                    <VistaSupervisor
                        userName={this.props.userName}
                        id={this.props.id}
                        socket ={this.props.socket} 
                    />
                :
                <div className="text-center h-100">
                    <h1 className="mt-5">¡Aún no estas loggeado!</h1>
                    <p>Debes estar loggeado para poder interactuar</p>
                    <p>Inicia sesión dando click en Iniciar sesión, o da click <Link to="/login">aqui</Link></p>
                </div>                 
                }
            </div>
        )
    }
}