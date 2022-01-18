//modulos
import React, { Component } from "react";
import { Redirect } from "react-router";
import { Alert } from "react-bootstrap";
//assets
import "./login.css";

/**
 * @author @AmelieCruz
 * Componente que define la vista del Login
 * @argument {boolean} isLogged -- estado que indica si el usuario está loggeado
 * @argument {Socket} socket -- websocket conectado al server
 * @argument {Function} setUserInfo -- handler de información del usuario para cuando se loggea
 * @argument {Function} setIsLogged -- handler del estado isLogged para cuando se loggea
 */
export default class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {
            usuario: "",
            password: "",
			sending: false,
			colorAlert: "success",
			showAlert: false,
			alertMessage: ""
        }
        this.handleChangeUser = this.handleChangeUser.bind(this);
        this.handleChangePassword = this.handleChangePassword.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.setSocketListeners = this.setSocketListeners.bind(this);
        this.handleEnter = this.handleEnter.bind(this);
        this.input = undefined;
    }
    componentDidMount() {
        this.setSocketListeners()
    }
    setSocketListeners() {
        const socket = this.props.socket;
        socket.on("error-login", errorCount => {
            this.setState({
				alertMessage: "Ocurrió un error al iniciar sesión",
				colorAlert: "danger",
				showAlert: true
			})
        })
        socket.on("incorrect-login", errorCount => {
            this.setState({
				alertMessage: "El usuario o la contraseña son incorrectos",
				colorAlert: "danger",
				showAlert: true
			})
        })
        socket.on("logged", userInfo => {
            this.props.setUserInfo(userInfo);
            this.props.setIsLogged(true);
        })
    }
    handleChangePassword(event) {
        const {target } = event
        this.setState({ password: target.value });
        if(target.value.includes("--")){
            target.setCustomValidity("La contraseña no puede contener la cadena especial '--'")
            target.reportValidity();
            target.valid = false;
        }else{
            target.valid = true;
        }
    }
    handleChangeUser(event) {
        const {target} = event
        this.setState({ usuario: target.value });
        if(target.value.includes("--")){
            target.setCustomValidity("El usuario debe ser un correo válido, no puede contener la cadena especial '--'")
            target.reportValidity();
            target.valid = false;
        }else{
            target.valid = true;
        }
    }
    handleEnter(event = Event) {
        // console.log("se teclea: ", event, " ", event);
        if (event.wich === 13 || event.keyCode === 13) {
            this.handleSubmit();
        }
    }

    handleSubmit() {
        const socket = this.props.socket;
        if (this.state.password == "" || this.state.usuario == "") {
            alert("debes rellenar todos los campos");
            return;
        }
        const usr = document.getElementById("inputUsuario")
        const pass = document.getElementById("inputContraseña")
        if(!usr.valid || !pass.valid ) {
            console.log("not valid");
            usr.reportValidity();
            pass.reportValidity();
            return
        }
        this.setState({
            sending: true
        })
        socket.emit("login", {
            userName: this.state.usuario,
            password: this.state.password
        });
    }
    render() {
        if (this.props.isLogged) {
            return <Redirect to='/' />
        } else
            return (
                <div className="hvh-100 d-flex justify-content-start flex-column">
                    <div className="alert-container">
						<div className="alert-size">
							{this.state.showAlert ?
								<Alert
									variant={this.state.colorAlert}
									onClose={() => this.setState({ showAlert: false })}
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
                    <h1 className="text-center display-6 m-5">Iniciar Sesión</h1>
                    <div className="mt-5 d-flex justify-content-center align-itens-center h-100" >
                        <form className="login-form">
                            <div className="form-floating mb-4">
                                <input
                                    type="email"
                                    className="form-control"
                                    id="inputUsuario"
                                    onKeyDown={this.handleEnter}
                                    placeholder="introduce tu nombre de usuario"
                                    onChange={this.handleChangeUser}

                                />
                                <label htmlFor="inputUsuario" >Usuario</label>
                            </div>
                            <div className="form-floating">
                                <input
                                    type="password"
                                    className="form-control"
                                    id="inputContraseña"
                                    placeholder="introduce tu nombre de usuario"
                                    onKeyDown={this.handleEnter}
                                    onChange={this.handleChangePassword} />
                                <label htmlFor="inputContraseña" >Contraseña</label>
                            </div>
                            <div className="form-group d-flex justify-content-center mt-5">
                                <a className={`btn btn-primary form-control ${this.state.sending?"disabled":""} `} role="button" onClick={this.handleSubmit}>Iniciar Sesión</a>
                            </div>
                        </form>
                    </div>
                </div>
            )
    }
}