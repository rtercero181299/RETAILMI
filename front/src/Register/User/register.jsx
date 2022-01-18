/**
 * Modulos
 */
import React, { Component } from "react";
import { Redirect } from "react-router";
import { Alert } from "react-bootstrap";

/**
 * Constantes
 */
import { API } from "../../enviroment/Credentials";

/**
 * Estilos
 */
import "./register.css";

export default class Register extends Component {
	constructor(props) {
		super(props);
		this.state = {
			usuario: this.props.usuario?.nombreUsuario || "",
			nombre: this.props.usuario?.nombreCompleto || "",
			contrasenia: this.props.usuario?.password || "",
			repContrasenia: this.props.usuario?.password || "",
			vccId: [],
			campania: [],
			supervisor: [],
			allAgentes: [],
			allAdministradores: [],
			tiposUsuario: [],
			vcc: this.props.usuario?.idVcc || 1,
			ca: this.props.usuario?.idCampania || 1,
			supervisores: this.props.usuario?.supervisores || [],
			agentes: this.props.usuario?.agentes || [],
			tipoUsuario: this.props.usuario?.tipoUsuario || 1,
			sending: false,
			colorAlert: "success",
			showAlert: false,
			alertMessage: ""
		}

		this.handleChangeUsuario = this.handleChangeUsuario.bind(this);
		this.handleChangeNombre = this.handleChangeNombre.bind(this);
		this.handleChangeContrasenia = this.handleChangeContrasenia.bind(this);
		this.handleChangeRepContrasenia = this.handleChangeRepContrasenia.bind(this);
		this.handleChangeVccId = this.handleChangeVccId.bind(this);
		this.handleChangeCampania = this.handleChangeCampania.bind(this);
		this.handleChangeSupervisores = this.handleChangeSupervisores.bind(this);
		this.handleChangeAgentes = this.handleChangeAgentes.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
		this.handleChangeTiposUsuario = this.handleChangeTiposUsuario.bind(this)
		this.getData = this.getData.bind(this);
		this.resetAll = this.resetAll.bind(this);
		this.handleCloseAlert = this.handleCloseAlert.bind(this);
	}
	componentDidMount() {
		this.getData();
	}
	resetAll() {

		if (this.props.resetAll) {
			setTimeout(() => {
				this.props.resetAll();
			}, 3000);
		}
		this.setState(
			{
				usuario: "",
				nombre: "",
				contrasenia: "",
				repContrasenia: "",
				vcc: 1,
				ca: 1,
				supervisores: [],
				agentes: [],
				tipoUsuario: 1,
				sending: false
			}
		)
	}
	async getData() {
		const options = {
			method: "post",
			mode: "cors",
			headers: {
				"Content-Type": "application/json"
			},
		}
		//list VccId
		const resp = await fetch(API.LIST_VCC_VALUES, options)
		const data = await resp.json();
		console.log("datos recibidos: ", data)
		this.setState({ vccId: data , vcc: data[0]})

		//list Compania
		const respD = await fetch(API.LIST_CAMPANIA_VALUES, options)
		const dataD = await respD.json();
		// console.log("datos recibidos: ", dataD)
		this.setState({ campania: dataD })

		//list Supervisor
		//list tipos usuario
		const respTU = await fetch(API.LIST_TIPOS_USUARIO_VALUES, options)
		const dataTU = await respTU.json();
		this.setState({ tiposUsuario: dataTU })
		// console.log("datos recibidos: ", dataTU)
		const respUsuarios = await fetch(API.LIST_ALL_USERS, {
			...options,
			body: JSON.stringify({
				idVcc: this.props.idVcc
			})
		})
		let dataUsuarios = await respUsuarios.json();
		if (this.props.user?.id) dataUsuarios = dataUsuarios.filter(usr => usr.id != this.props.user?.id);
		// console.log("datos recibidos: ", dataUsuarios)

		const agentes = dataUsuarios.filter(usr => usr.tipoUsuario == 1)
		const supervisores = dataUsuarios.filter(usr => usr.tipoUsuario == 2)
		const administradores = dataUsuarios.filter(usr => usr.tipoUsuario == 3)
		this.setState({
			supervisor: supervisores,
			allAgentes: agentes,
			allAdministradores: administradores
		})

	};

	handleChangeUsuario({target}) {
		const { value } = target
		this.setState({ usuario: value});
		if (value.includes("--")) {
			target.setCustomValidity("El usuario debe ser un correo válido, no puede contener la cadena especial '--'")
			target.reportValidity();
			target.valid = false;
		} else {
			target.valid = true;
		}
	}

	handleChangeNombre(event) {
		this.setState({ nombre: event.target.value });
	}

	handleChangeContrasenia(event) {
		const { target } = event
		this.setState({ contrasenia: target.value });
		if (target.value.includes("--")) {
			target.setCustomValidity("La contraseña no puede contener la cadena especial '--'")
			target.reportValidity();
			target.valid = false;
		} else {
			target.valid = true;
		}
	}

	handleChangeRepContrasenia(event) {
		this.setState({ repContrasenia: event.target.value });
	}

	handleChangeVccId(event) {
		const { vccId } = this.state;
		this.setState({ vcc: vccId.find(vcc => vcc.vccId == event.target.value) });

	}

	handleChangeCampania(event) {
		this.setState({ ca: event.target.value });
	}

	handleChangeSupervisores(event) {
		let supervisores = this.state.supervisores;
		if (event.target.checked) {
			supervisores.push(event.target.value)
		} else {
			let index = supervisores.findIndex(sup => sup == event.target.value);
			supervisores.splice(index, 1)
		}
		// console.log("supervisores: ", supervisores);
		this.setState({ supervisores: supervisores })
	}
	handleChangeAgentes(event) {
		let agentes = this.state.agentes;
		if (event.target.checked) {
			agentes.push(event.target.value)
		} else {
			let index = agentes.findIndex(agt => agt == event.target.value);
			agentes.splice(index, 1)
		}
		this.setState({ agentes: agentes })
	}

	handleChangeTiposUsuario(event) {
		this.setState({ tipoUsuario: event.target.value });
	}

	async handleSubmit(event) {
		const usr = document.getElementById("formUsuario")
		const pass = document.getElementById("formContrasenia")
		if (!usr.valid || !pass.valid) {
			console.log("not valid");
			usr.reportValidity();
			pass.reportValidity();
			return
		}
		if (this.props.usuario?.tipoUsuario == 0) {
			this.setState({
				alertMessage: "Elije que usuario deseas modificar",
				colorAlert: "warning",
				showAlert: true
			})
			return
		}
		if (this.state.tipoUsuario == "" || this.state.usuario == "" || this.state.contrasenia == "") {
			this.setState({
				alertMessage: "rellena todos los campos",
				colorAlert: "danger",
				showAlert: true
			})
			return;
		}
		if (this.state.contrasenia !== this.state.repContrasenia) {
			this.setState({
				alertMessage: "las contraseñas no coinciden",
				colorAlert: "danger",
				showAlert: true
			})
			return;
		}
		this.setState({ sending: true });
		const user = this.state.usuario.concat("@", this.state.vcc.vccAcronimo);
		let options = {
			method: "POST",
			mode: "cors",
			headers: {
				"Content-Type": "application/json"
			},
			body: JSON.stringify({
				usuario: user,
				usuario_strNombreCompleto: this.state.nombre,
				password: this.state.contrasenia,
				usuario_intVccId: this.state.vcc.vccId,
				usuario_intCampañaId: this.state.ca,
				usuario_intSupervisoresId: this.state.supervisores,
				tipoUsuario: this.state.tipoUsuario,
				agentes: this.state.agentes,
				idSupervisor: this.props.id,
				idUsuario: this.props.usuario?.id || null
			})
		}
		const api = this.props.title == "Registrar" ? API.REGISTER_USER : API.MODIFY_USER
		const resultado = await fetch(api, options);
		const data = await resultado.json();

		console.log(data, "datos traidos");
		switch (data.result) {
			case 'correcto':
				this.setState({
					alertMessage: `se ${this.props.title == "Registrar" ? "registró" : "modificó"} el usuario correctamente`,
					colorAlert: "success"
				});
				this.resetAll();
				break;
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
					alertMessage: "Ya existe un usuario registrado con ese nombre de usuario, por favor elige otro",
					colorAlert: "info"
				})
				break;
			default:
				break;
		}
		this.setState({ sending: false, showAlert: true });
		// setTimeout(() => {
		// 	this.setState({showAlert: false});
		// }, 3000);
	}
	handleCloseAlert() {
		this.setState({ showAlert: false });
	}

	render() {
		if (!this.props.isLogged) {
			return (
				<Redirect to="/" />
			)
		}
		if (this.props.tipoUsuario > 2) {
			const supervisores = this.state.tipoUsuario == 1 ? this.state.supervisor.concat(this.state.allAdministradores) :
				this.state.allAdministradores;
			return (
				<div className="hvh-100 d-flex justify-center-start flex-column">
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
					<h1 className={`text-center display-6 ${this.props.title == "Registrar" ? "m-5" : ""}`}> {this.props.title} </h1>
					<div className="d-flex justify-content-center align-itens-center h-100" >
						<form className="register-form">
							<div className="row mb-4">
								<div className="col-sm-12 col-md-12 col-lg-6 col-xl-6">
									<div className="input-group">
										<div className="form-floating">
											<input type="text" className="form-control" id="formUsuario" placeholder="Escribe el usuario" onChange={this.handleChangeUsuario} value={this.state.usuario} />
											<label htmlFor="Usuario"> Usuario </label>
										</div>
										<div className="input-group-append">
											<span className="input-group-text" id="basic-addon1">@{this.state.vcc.vccAcronimo}</span>
										</div>
									</div>
								</div>
								<div className="col-sm-12 col-md-12 col-lg-6 col-xl-6">
									<div className="form-floating">
										<input type="text" className="form-control" id="formNombre" placeholder="Escribe el nombre" onChange={this.handleChangeNombre} value={this.state.nombre} />
										<label htmlFor="Nombre"> Nombre </label>
									</div>
								</div>
							</div>
							<div className="row mb-4">
								<div className="col-sm-12 col-md-12 col-lg-6 col-xl-6">
									<div className="form-floating">
										<input type="password" className="form-control" id="formContrasenia" placeholder="Introduce tu contraseña" onChange={this.handleChangeContrasenia} value={this.state.contrasenia} />
										<label htmlFor="Contrasenia" >Contraseña</label>
									</div>
								</div>
								<div className="col-sm-12 col-md-12 col-lg-6 col-xl-6">
									<div className="form-floating">
										<input type="password" className="form-control" id="formRepContrasenia" placeholder="Introduce tu contraseña" onChange={this.handleChangeRepContrasenia} value={this.state.repContrasenia} />
										<label htmlFor="Contrasenia" >Repite tu Contraseña</label>
									</div>
								</div>
							</div>
							<div className="row mb-4">
								<div className="col-sm-12 col-md-12 col-lg-6 col-xl-6">
									<div className="form-floating">
										<select className="select-class form-select form-select-sm mb-3 mt-3" id="select-tipoUsuario" onChange={this.handleChangeTiposUsuario} defaultValue={this.state.tipoUsuario} >
											{
												this.state.tiposUsuario?.map((item, index) => {
													return (
														<option key={index} value={item.id}>{
															item.nombre
														}</option>
													)
												})
											}
										</select>
										<label htmlFor="select-tipoUsuario">Tipo Usuario</label>
									</div>
								</div>
								<div className="col-sm-12 col-md-12 col-lg-6 col-xl-6">
									<div className="form-floating">
										<select className="select-class form-select form-select-sm mb-3 mt-3" id="select-vcc" onChange={this.handleChangeVccId} defaultValue={this.state.vcc}>
											{
												this.state.vccId?.map((item, index) => {
													return (
														<option key={index} value={item.vccId}>{
															item.vccNombre
														}</option>
													)
												})
											}
										</select>
										<label htmlFor="select-vcc">Empresa</label>
									</div>
								</div>
								<div className="col-sm-12 col-md-12 col-lg-6 col-xl-6">
									<div className="form-floating">
										<select className="select-class form-select form-select-sm mb-3 mt-3" id="select-campania" onChange={this.handleChangeCampania} defaultValue={this.state.ca}>
											{
												this.state.campania?.map((item, index) => {
													return (
														<option key={index} value={item.campania_intId}>{
															item.campania_strNombre
														}</option>
													)
												})
											}
										</select>
										<label htmlFor="select-campania">Campaña</label>
									</div>
								</div>
								{
									this.state.tipoUsuario > 0 ?
										<div className="col-sm-12 col-md-12 col-lg-6 col-xl-6">
											<label className="h5">{this.state.tipoUsuario == 1 ? "Supervisores" : "Administradores"}</label>
											{
												supervisores?.map((item, index) => {
													// console.log("supervisor item: ", item, "supervisores: ", this.props.usuario?.supervisores);
													const isSupervisor = this.state.supervisores?.some(supervisor => supervisor == item.id)
													return (
														<div className="form-check" key={index}>
															<input checked={isSupervisor} className="form-check-input" type="checkbox" value={item.id} id={"supervisor-" + index} onChange={this.handleChangeSupervisores} />
															<label className="form-check-label" htmlFor={"supervisor-" + index}>
																{
																	item.nombreUsuario
																}
															</label>
														</div>
													)
												})
											}
										</div>
										:
										""
								}

								{
									this.state.tipoUsuario > 1 ?
										<div className="col-sm-12 col-md-12 col-lg-6 col-xl-6">
											<label className="h5">Agentes</label>
											{
												this.state.allAgentes?.map((item, index) => {
													const isAgente = this.state.agentes?.some(agente => agente.id == item.id)
													return (
														<div className="form-check" key={index}>
															<input checked={isAgente} className="form-check-input" type="checkbox" value={item.id} id={"agente-" + index} onChange={this.handleChangeAgentes} />
															<label className="form-check-label" htmlFor={"agente-" + index}>
																{
																	item.nombreUsuario
																}
															</label>
														</div>
													)
												})
											}
										</div>
										:
										""
								}
								{
									this.state.tipoUsuario > 2 ?
										<div className="col-sm-12 col-md-12 col-lg-6 col-xl-6">
											<label className="h5">Supervisores</label>
											{
												this.state.supervisor?.map((item, index) => {
													const isAgente = this.state.agentes?.some(agente => agente.id == item.id)
													return (
														<div className="form-check" key={index}>
															<input checked={isAgente} className="form-check-input" type="checkbox" value={item.id} id={"supervisor-" + index} onChange={this.handleChangeAgentes} />
															<label className="form-check-label" htmlFor={"supervisor-" + index}>
																{
																	item.nombreUsuario
																}
															</label>
														</div>
													)
												})
											}
										</div>
										:
										""
								}
							</div>
							<div className="row">
								<div className="col-12 d-flex justify-content-center aling-items-center">
									<div className="form-group d-flex justify-content-center mt-5">
										<button disabled={this.state.sending} className="btn btn-primary form-control " onClick={this.handleSubmit}>{this.props.title}</button>
									</div>
								</div>
							</div>
						</form>
					</div>
				</div>

			)
		} else {
			// console.log("tipo usuario: ", this.props.tipoUsuario)
			return (
				<div className="text-center h-100">
					<h1 className="mt-5">¡No tienes los permisos para visualizar esta ventana!</h1>
					<p>Debes ser Administrador o un rango más arriba para poder entrar aquí</p>
				</div>
			)
		}
	}

}