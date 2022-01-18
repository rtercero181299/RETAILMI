//modulos
import React,{Component} from "react";


//assets
import "./logout.css";

/**
 * @author @AmelieCruz
 * Componente que renderiza la vista de Cerrado de sesión
 * @argument {boolean} isLogged -- estado que indica si el usuario está loggeado
 * @argument {Number | String} id -- estado que guarda el id del usuario actual
 * @argument {Socket} socket -- websocket conectado al server
 * @argument {Function} setUserInfo -- handler de información del usuario para cuando se loggea
 * @argument {Function} setIsLogged -- handler del estado isLogged para cuando se loggea
 */
export default class Logout extends Component{
    constructor(props){
        super(props);
        console.log("is creating logout");
    }
    componentDidMount(){
        this.props.setIsLogged(false);
        this.props.setUserInfo({});
        window.location="/#";
        this.props.socket.emit("cambio-estado", {
            idUsuario: this.props.id, 
            idEstado: 7,
            fechaInicio:  new Date(),
            nombre: "Desconectado"
        })
        this.props.socket.emit("logout", this.props.id);
    }
    render(){   
        return(
            <h1 className="text-center">Cerrando sesión...</h1>
        )
    }
}