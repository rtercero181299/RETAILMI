/**
 * Modulos
 */
import React, { Component } from "react";
import { Redirect } from "react-router";
import { Alert } from "react-bootstrap";
/**
 * Iconos
 */
import { AiOutlinePlusCircle, AiOutlineMinusCircle } from "react-icons/ai"
/**
 * Estilos
 */
import "./register.css";
/**
 * Modelos y Constantes
 */
import { API } from "../../enviroment/Credentials";

/**
 * @author AmelieCruz
 * Componente que modela el formulario para registrar una empresa
 * @argument {Comany: { nombre: String, acronimo: String, kams: []<Usuaro>, rfc: String, direccion: String, telefonos: []<string>, emails: []<String> }} company (opcional) -- objeto que contiene la información de una compañía a editar
 */
export default class RegisterCompany extends Component {
	constructor(props) {
		super(props);
		this.state = {
			nombre: this.props.company?.nombre || "",
			acronimo: this.props.company?.acronimo || "",
			kams: this.props.company?.kams || [],
			kamActual: "",
			rfc: this.props.company?.rfc || "",
			direccion: this.props.company?.direccion || "",
			telefonos: this.props.company?.telefonos || [],
			telefonoActual: "",
			emails: this.props.company?.emails || [],
			emailActual: "",
			polizasAgentes: this.props.company?.polizasAgentes || 0,
			polizasSupervisores: this.props.company?.polizasSupervisores || 0,
			polizasAdministradores: this.props.company?.polizasAdministradores || 0,
			sending: false,
			colorAlert: "success",
			showAlert: false,
			alertMessage: "",
			usuarios: [],
		}

		this.handleChangeNombre = this.handleChangeNombre.bind(this);
		this.handleChangeAcronimo = this.handleChangeAcronimo.bind(this)
		this.handleAddKams = this.handleAddKams.bind(this)
		this.handleRemoveKams = this.handleRemoveKams.bind(this)
		this.handleChangeKamActual = this.handleChangeKamActual.bind(this)
		this.handleChangeRfc = this.handleChangeRfc.bind(this)
		this.handleChangePolizasAgentes = this.handleChangePolizasAgentes.bind(this)
		this.handleChangePolizasSupervisores = this.handleChangePolizasSupervisores.bind(this)
		this.handleChangePolizasAdministradores = this.handleChangePolizasAdministradores.bind(this)
		this.handleChangeDireccion = this.handleChangeDireccion.bind(this)
		this.handleAddTelefonos = this.handleAddTelefonos.bind(this)
		this.handleRemoveTelefonos = this.handleRemoveTelefonos.bind(this)
		this.handleChangeTelefonoActual = this.handleChangeTelefonoActual.bind(this)
		this.handleAddEmails = this.handleAddEmails.bind(this)
		this.handleRemoveEmails = this.handleRemoveEmails.bind(this)
		this.handleSubmit = this.handleSubmit.bind(this);
		this.getData = this.getData.bind(this);
		this.resetAll = this.resetAll.bind(this);
		this.handleChangeEmailActual = this.handleChangeEmailActual.bind(this);
		this.handleCloseAlert = this.handleCloseAlert.bind(this);
	}
	componentDidMount() {
		this.getData();
	}
	resetAll() {
		this.setState({
			nombre: this.props.company?.nombre || "",
			acronimo: this.props.company?.acronimo || "",
			kams: this.props.company?.kams || [],
			kamActual: "",
			rfc: this.props.company?.rfc || "",
			direccion: this.props.company?.direccion || "",
			telefonos: this.props.company?.telefonos || [],
			telefonoActual: "",
			emails: this.props.company?.emails || [],
			emailActual: "",
			polizasAgentes: this.props.company?.polizasAgentes || 0,
			polizasSupervisores: this.props.company?.polizasSupervisores || 0,
			polizasAdministradores: this.props.company?.polizasAdministradores || 0,
		})
	}

	async getData() {
		const options = {
			method: "post",
			mode: "cors",
			headers: {
				"Content-Type": "application/json"
			},
			body: JSON.stringify({
				idVcc: this.props.idVcc
			})
		}
		const respUsuarios = await fetch(API.LIST_ALL_USERS, options)
		const dataUsuarios = await respUsuarios.json();
		this.setState({
			usuarios: dataUsuarios,
			kamActual: dataUsuarios[0]
		})

	};

	handleChangeNombre({ target }) {
		const { value } = target
		this.setState({ nombre: value })
	}
	handleChangeAcronimo({ target }) {
		const { value } = target
		this.setState({ acronimo: value })
		const regex = /^[a-z]+$/gm
		if (!regex.test(value)) {
			target.valid = false;
			target.setCustomValidity("el acrónimo solo debe contener minúsculas");
			target.reportValidity();
		} else {
			target.valid = true;
		}
	}
	handleAddKams(kamsUsr) {
		const { kams, kamActual } = this.state;
		kams.push(kamActual);
		this.setState({ kams: kams })
	}
	handleRemoveKams(kamsUsr) {
		const { kams } = this.state;
		this.setState({ kams: kams.filter(kamsUser => kamsUser.id != kamsUsr.id) })
	}

	handleChangeKamActual({ target }) {
		const { value } = target
		const { usuarios } = this.state
		console.log("kam selected: ", value);

		this.setState({ kamActual: usuarios.find(usr => usr.id == value) })
	}
	handleChangeRfc({ target }) {
		const { value } = target
		this.setState({ rfc: value })
		const regex = /[a-zA-Z]{4}[0-9]{6}[a-zA-Z0-9]{3}$/gm;
		if (value.length < 13) return;
		if (!regex.test(value)) {
			target.setCustomValidity("Ingrese un rfc válido");
			target.reportValidity();
			target.valid = false;
		} else {
			target.setCustomValidity("");
			target.valid = true;

		}
	}
	handleChangeDireccion({ target }) {
		const { value } = target
		this.setState({ direccion: value })
	}
	handleChangePolizasAgentes({ target }) {
		const { value } = target
		this.setState({ polizasAgentes: value })
	}
	handleChangePolizasSupervisores({ target }) {
		const { value } = target
		this.setState({ polizasSupervisores: value })
	}
	handleChangePolizasAdministradores({ target }) {
		const { value } = target
		this.setState({ polizasAdministradores: value })
	}

	handleAddTelefonos(telefono) {
		const { telefonos, telefonoActual } = this.state;
		const formTelefono = document.querySelector("#formTelefono");
		if (!formTelefono.valid) {
			formTelefono.reportValidity();
			return;
		}
		if (telefonos.some(tel => tel.includes(telefonoActual))) {
			formTelefono.setCustomValidity("Este teléfono ya ha sido agregado");
			formTelefono.reportValidity();
			formTelefono.valid = false;
			return
		}
		if(telefonoActual == ""){
			formTelefono.setCustomValidity("Debes rellenar el campo");
			formTelefono.reportValidity();
			formTelefono.valid = false;
			return
		}
		formTelefono.valid = true;
		telefonos.push(telefonoActual);
		this.setState({ telefonos: telefonos, telefonoActual: "" })
	}
	handleRemoveTelefonos(telefono) {
		const { telefonos } = this.state;
		this.setState({ telefonos: telefonos.filter(telefonoBefore => telefonoBefore != telefono) })
	}

	handleChangeTelefonoActual({ target }) {
		target.setCustomValidity("");
		target.reportValidity();
		const regex = /\+\([0-9]{2}\)[0-9]{10}$/s
		const regex2 = /[0-9]{10}$/
		const valueTest = target.value.trim();
		this.setState({ telefonoActual: target.value })
		if ((!(regex.test(valueTest) || (regex2.test(valueTest)))) && valueTest.length > 9) {
			target.valid = false;
			target.setCustomValidity("El telefono debe ser un formato válido");
			target.reportValidity();
		} else {
			target.valid = true;
		}
	}

	handleAddEmails(emailSelected) {
		const { emails, emailActual } = this.state;
		const formEmail = document.querySelector("#formEmail");
		if (!formEmail.valid) {
			formEmail.reportValidity();
			return;
		}
		if (emails.some(mail => mail == emailActual)) {
			formEmail.setCustomValidity("Este email ya ha sido agregado");
			formEmail.reportValidity();
			formEmail.valid = false;
			return
		} else {
			formEmail.valid = true;
		}
		emails.push(emailActual);
		this.setState({ emails: emails, emailActual: "" })
	}
	handleRemoveEmails(emailSelected) {
		const { emails } = this.state;
		this.setState({ emails: emails.filter(emailBefore => emailBefore != emailSelected) })
	}
	handleChangeEmailActual({ target }) {
		const { value } = target
		const regex = /.*@.*\..*/s
		if (!regex.test(value)) {
			target.valid = false;
			target.setCustomValidity("Debe ser un email válido");
			target.reportValidity();
		} else {
			target.valid = true;
		}
		this.setState({ emailActual: value });
	}
	async handleSubmit(event) {
		if (this.props.usuario?.tipoUsuario == 0) {
			this.setState({
				alertMessage: "Elije que usuario deseas modificar",
				colorAlert: "warning",
				showAlert: true
			})
			return
		}
		const {
			nombre,
			acronimo,
			kams,
			kamActual,
			rfc,
			direccion,
			telefonos,
			telefonoActual,
			emails,
			emailActual,
			polizasAgentes,
			polizasSupervisores,
			polizasAdministradores,
		} = this.state
		if (nombre == ""
			|| acronimo == ""
			|| direccion == ""
			|| (
				polizasAgentes == 0
				&& polizasSupervisores == 0
				&& polizasAdministradores == 0
			)
		) {
			this.setState({
				alertMessage: "rellena todos los campos",
				colorAlert: "danger",
				showAlert: true
			})
			return;
		}
		const formAcronimo = document.querySelector('#formAcronimo')
		const formRfc = document.querySelector('#formRfc')
		const formTelefono = document.querySelector('#formTelefono')
		const formEmail = document.querySelector('#formEmail')
		if (!(formAcronimo.valid
			&& formRfc.valid
			&& formTelefono.valid
			&& formEmail.valid)) {
			formAcronimo.reportValidity();
			formRfc.reportValidity();
			formTelefono.reportValidity();
			formEmail.reportValidity();
			return;
		}
		if (emails.length == 0) {
			if (emailActual == "") {
				formEmail.setCustomValidity("Debes ingresar al menos 1 email")
				formEmail.reportValidity();
				return;
			} else {
				emails.push(emailActual)
			}
		}
		if (kams.length == 0) {
			kams.push(kamActual)

		}
		if (telefonos.length == 0) {
			if (telefonoActual == "") {
				formTelefono.setCustomValidity("Debes ingresar al menos 1 teléfono")
				formTelefono.reportValidity();
				return;
			} else {
				telefonos.push(telefonoActual)
			}
		}
		this.setState({ sending: true });
		let options = {
			method: "POST",
			mode: "cors",
			headers: {
				"Content-Type": "application/json"
			},
			body: JSON.stringify({
				nombre: nombre,
				acronimo: acronimo,
				kams: kams.map(kam => kam.id),
				rfc: rfc,
				direccion: direccion,
				telefonos: telefonos,
				emails: emails,
				idAdmin: this.props.id,
				polizasAgentes: polizasAgentes,
				polizasSupervisores: polizasSupervisores,
				polizasAdministradores: polizasAdministradores
			})
		}
		const api = this.props.title == "Registrar" ? API.REGISTER_COMPANY : API.MODIFY_COMPANY
		const resultado = await fetch(api, options);
		const data = await resultado.json();

		console.log(data, "datos traidos");
		switch (data.result) {
			case 'correcto':
				this.setState({
					alertMessage: `se ${this.props.title == "Registrar" ? "registró" : "modificó"} la compañia correctamente`,
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
				this.resetAll();
				break;
			default:
				break;
		}
		this.setState({ sending: false, showAlert: true });
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
							<div className="row">
								<div className="col-sm-12 col-md-12 col-lg-6 col-xl-6">
									<div className="row mb-4">
										<div className="form-floating">
											<input
												type="text"
												className="form-control"
												id="formNombre"
												placeholder="Escribe el nombre de la compañia"
												onChange={this.handleChangeNombre}
												value={this.state.nombre} />
											<label htmlFor="formNombre"> Nombre de la compañia </label>
										</div>
									</div>
									<div className="row mb-4">
										<div className="form-floating">
											<input type="text"
												className="form-control"
												id="formRfc"
												placeholder="Escribe el acrónimo"
												onChange={this.handleChangeRfc}
												value={this.state.rfc} />
											<label htmlFor="formRfc"> RFC </label>
										</div>
									</div>
									<div className="row mb-4">
										{
											this.state.telefonos.map((tel, index) => (
												<div key={index} className="input-group mb-2">
													<div className="form-floating">
														<input
															type="text"
															className="form-control"
															id={"formTelefono-" + index}
															placeholder="Escribe el nombre de la compañia"
															disabled
															value={tel} />
														<label htmlFor={"formTelefono-" + index}> Telefono {index + 1} </label>
													</div>
													<div className="input-group-append">
														<button
															className="btn btn-outline-secondary"
															onClick={() => this.handleRemoveTelefonos(tel)}
														>
															<AiOutlineMinusCircle
																size={30}
																style={{
																	marginTop: -5
																}}
															/>
														</button>
													</div>
												</div>
											))
										}
										<div className="input-group">
											<div className="form-floating">
												<input
													type="text"
													className="form-control"
													id="formTelefono"
													placeholder="Escribe el nombre de la compañia"
													onChange={this.handleChangeTelefonoActual}
													value={this.state.telefonoActual} />
												<label htmlFor="formTelefono"> Telefono {isNaN(this.state.telefonos.length) ? 1 : (this.state.telefonos.length + 1)} </label>
											</div>
											<div className="input-group-append">
												<button
													className="btn btn-outline-secondary"
													onClick={this.handleAddTelefonos}
												>
													<AiOutlinePlusCircle
														size={30}
														style={{
															marginTop: -5
														}}
													/>
												</button>
											</div>
										</div>
									</div>
									<div className="row mb-4">
										{
											this.state.kams.map((kam, index) => {
												// console.log("kam ", index, kam);
												return (
													<div key={index} className="input-group mb-2">
														<div className="form-floating">
															<input
																type="email"
																className="form-control"
																id={"formKam-" + index}
																placeholder="Escribe el nombre de la compañia"
																disabled
																value={kam.nombreCompleto} />
															<label htmlFor={"formKam-" + index}> Key Account Manager {index + 1} </label>
														</div>
														<div className="input-group-append">
															<button
																className="btn btn-outline-secondary"
																onClick={() => this.handleRemoveKams(kam)}
															>
																<AiOutlineMinusCircle
																	size={30}
																	style={{
																		marginTop: -5
																	}}
																/>
															</button>
														</div>
													</div>
												)
											}
											)
										}
										<div className="input-group">
											<div className="form-floating">
												<select
													type="mail"
													className="form-control"
													id="formKam"
													placeholder="Escribe el nombre de la compañia"
													onChange={this.handleChangeKamActual}
												>
													{
														this.state.usuarios?.map((usr, index) => (
															<option
																key={index}
																value={usr.id}
															>{usr.nombreCompleto}</option>
														))
													}
												</select>
												<label htmlFor="formKam"> Key Account Manager {isNaN(this.state.kams.length) ? 1 : (this.state.kams.length + 1)} </label>
											</div>
											<div className="input-group-append">
												<button
													className="btn btn-outline-secondary"
													onClick={this.handleAddKams}
												>
													<AiOutlinePlusCircle
														size={30}
														style={{
															marginTop: -5
														}}
													/>
												</button>
											</div>
										</div>
									</div>
								</div>
								<div className="col-6">
									<div className="row mb-4">
										<div className="input-group">
											<div className="input-group-prepend">
												<span className="input-group-text" id="basic-addon1">@</span>
											</div>
											<div className="form-floating">
												<input type="text"
													className="form-control"
													id="formAcronimo"
													placeholder="Escribe el acrónimo"
													onChange={this.handleChangeAcronimo}
													value={this.state.acronimo} />
												<label htmlFor="formAcronimo"> Acrónimo </label>
											</div>
										</div>
									</div>
									<div className="row mb-4">
										<div className="form-floating">
											<textarea
												className="form-control"
												id="formDireccion"
												placeholder="Escribe la dirección"
												onChange={this.handleChangeDireccion}
												value={this.state.direccion}
											/>
											<label htmlFor="formDireccion"> Dirección </label>
										</div>
									</div>
									<div className="row mb-4">
										{
											this.state.emails.map((email, index) => (
												<div key={index} className="input-group mb-2">
													<div className="form-floating">
														<input
															type="email"
															className="form-control"
															id={"formEmail-" + index}
															placeholder="Escribe el nombre de la compañia"
															disabled
															value={email} />
														<label htmlFor={"formEmail-" + index}> Email {index + 1} </label>
													</div>
													<div className="input-group-append">
														<button
															className="btn btn-outline-secondary"
															onClick={() => this.handleRemoveEmails(email)}
														>
															<AiOutlineMinusCircle
																size={30}
																style={{
																	marginTop: -5
																}}
															/>
														</button>
													</div>
												</div>
											))
										}
										<div className="input-group">
											<div className="form-floating">
												<input
													type="mail"
													className="form-control"
													id="formEmail"
													placeholder="Escribe el nombre de la compañia"
													onChange={this.handleChangeEmailActual}
													value={this.state.emailActual} />
												<label htmlFor="formEmail"> Email {isNaN(this.state.emails.length) ? 1 : (this.state.emails.length + 1)} </label>
											</div>
											<div className="input-group-append">
												<button
													className="btn btn-outline-secondary"
													onClick={this.handleAddEmails}
												>
													<AiOutlinePlusCircle
														size={30}
														style={{
															marginTop: -5
														}}
													/>
												</button>
											</div>
										</div>
									</div>
									<div className="row mb-4">
										<div className="col-4">
											<div className="form-floating">
												<input
													type="number"
													className="form-control"
													id="formPolizasAgentes"
													placeholder="Escribe el nombre de la compañia"
													onChange={this.handleChangePolizasAgentes}
													min={0}
													value={this.state.polizasAgentes} />
												<label htmlFor="formPolizasAgentes"> Agentes </label>
											</div>
										</div>
										<div className="col-4">
											<div className="form-floating">
												<input
													type="number"
													className="form-control"
													id="formPolizasSupervisores"
													placeholder="Escribe el nombre de la compañia"
													min={0}
													onChange={this.handleChangePolizasSupervisores}
													value={this.state.polizasSupervisores} />
												<label htmlFor="formPolizasSupervisores"> Supervisores </label>
											</div>
										</div>
										<div className="col-4">
											<div className="form-floating">
												<input
													min={0}
													type="number"
													className="form-control"
													id="formPolizasAdministradores"
													placeholder="Escribe el nombre de la compañia"
													onChange={this.handleChangePolizasAdministradores}
													value={this.state.polizasAdministradores} />
												<label htmlFor="formPolizasAdministradores"> Administradores </label>
											</div>
										</div>
									</div>
								</div>
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
			return (
				<div className="text-center h-100">
					<h1 className="mt-5">¡No tienes los permisos para visualizar esta ventana!</h1>
					<p>Debes ser Administrador o un rango más arriba para poder entrar aquí</p>
				</div>
			)
		}
	}

}