/**
 * Modulos
 */
import React, {Component} from "react";
import { Link } from "react-router-dom";
/**
 * Assets
 */
import logo from "../assets/img/Logo_Hz_Negativo.png";
/**
 * Estilos
 */
import "./navbar.css";
/**
 * @author @AmelieGranados
 * 
 * Componente que renderiza la barra superior del sistema
 * @argument {boolean} isLogged -- estado que indica si el usuario está loggeado
 * 
 */
export default class Navbar extends Component{
    constructor (props){
        super(props);
    }
    render(){
        return(
            <header>
                <nav className="navbar fixed-top navbar-expand-lg navbar-dark">
                    <div className="container">
                        <a href="/#/" className="navbar-brand" style={{border: "none"}}>
                            <img src={logo} alt="Ardabytec"  className="logo-navbar"/>
                        </a>
                        <button className="navbar-toggler " type="button" data-bs-toggle="collapse" data-bs-target="#navbarText" aria-controls="navbarText" aria-expanded="false" aria-label="Toggle navigation">
                            <span className="navbar-toggler-icon"></span>
                        </button>
                        <div className="collapse navbar-collapse align-items-end links" id="navbarText">
                            <ul className="navbar-nav mb-2 mb-lg-0 " style={{right:0}}>
                                {   
                                    !this.props.isLogged?
                                    <li className="nav-item-sup" >
                                        <Link to="/login" className="nav-link text-white">Iniciar sesión</Link>
                                    </li>
                                    :
                                    null
                                }
                            </ul>
                        </div>
                    </div>
                </nav>
            </header>
        )
    }
}