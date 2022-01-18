//modulos
import React, {Component} from "react";
import { Redirect } from "react-router";

//assets
import "./modify.css";

//variables de ambiente
import { API } from "../../enviroment/Credentials";

//Componentes
import Register from "../../Register/User/register.jsx";

/**
 * @author @AmelieCruzG
 * Componente que renderiza la vista para modificar la información de un usuario
 * @argument {boolean} isLogged -- estado que indica si el usuario está loggeado
 * @argument {Number | String} id -- estado que guarda el id del usuario actual
 * @argument {Socket} socket -- websocket conectado al server
 * @argument {Number | String} tipoUsuario -- estado que guarda el tipo de usuario loggeado
 * @argument {Number | String} idVcc -- estado que almacena el id del CC o compañía del usuario
 * 
 * 
 */
export default class Modify extends Component{
	constructor(props){
        super(props);
        this.state = {
            usuario: {
				tipoUsuario: 0
			},
            search:"",
			resultados:[]
        }
        this.handleSearch = this.handleSearch.bind(this);
        this.handleEnterSearch = this.handleEnterSearch.bind(this);
        this.handleChangeSearch = this.handleChangeSearch.bind(this);
		this.handleSelectUserModify = this.handleSelectUserModify.bind(this);
		this.resetAll = this.resetAll.bind(this)
    }
	resetAll(){
		this.setState({
			usuario: {
				tipoUsuario: 0
			},
            search:"",
			resultados:[]
		})
	}
    async handleSearch(){
        const options = {
			method:"post",
			mode: "cors",
            headers:{
                "Content-Type": "application/json"
            },
			body:JSON.stringify({
				searchString: this.state.search,
				idSupervisor: this.props.id
			})
		}
		// console.log("data send: ", options);
		const search = await fetch(API.SEARCH_USERS, options).catch(error=>console.error("error en la petición para hacer la búsqueda: ", error));
		if(search){
			const searchData = await search.json().catch(error=>console.error("error en el parseo de datos para hacer la búsqueda: ", error));
			if(searchData){
				if(searchData.length==1){
					this.handleSelectUserModify(searchData[0])
				}
				this.setState({resultados: searchData});
				// console.log("data recived: ", searchData);
			}
		}
		
    }
	handleEnterSearch(event){
		if(event.key == "Enter"){
			this.handleSearch()
		}
		event.stopPropagation();
	}
	handleChangeSearch(event){
		this.setState({search: event.target.value});
	}
	async handleSelectUserModify(usr){
		this.setState({usuario: {
			tipoUsuario: 0
		}})
		const options = {
			method:"post",
			mode: "cors",
            headers:{
                "Content-Type": "application/json"
            },
		}
		let agentes = await fetch(API.LIST_AGENTES, {...options, body:JSON.stringify({idSupervisor: usr.id})})
		let supervisores = await fetch(API.LIST_SUPERVISORES, {...options, body:JSON.stringify({idAgente: usr.id})})
		supervisores = await supervisores.json();
		agentes = await agentes.json();
		usr.supervisores = supervisores?.map(({id})=>id)
		usr.agentes = agentes?.map(({id})=>id)
		console.log("elegido: ", usr)
		this.setState({usuario: usr, search: ""})
	}
render(){
	if(!this.props.isLogged){
		return(
			<Redirect to="/"/>
		)
	}
	if(this.props.tipoUsuario > 2)
	return(
		<div className="vista-modificar hvh-100 d-flex justify-center-start flex-column pt-3">
		
			<div className="d-flex justify-content-center align-itens-center h-100 w-100" >
				<div className="row w-100">
					<div className="col-sm-12 col-md-12 col-lg-3 col-xl-4"></div>
					<div className="col-sm-12 col-md-12 col-lg-6 col-xl-4">
						<div className="d-flex align-items-center">
							<input type="text" className="form-control " placeholder="" onKeyPress={this.handleEnterSearch} onChange={this.handleChangeSearch} value={this.state.search}/>
							<a className="btn btn-primary m-2" onClick={this.handleSearch}>Buscar</a>
						</div>
					</div>
					<div className="col-sm-12 col-md-12 col-lg-3 col-xl-4"></div>
					<div className="col-sm-12 col-md-12 col-lg-6 col-xl-6">
						{this.state.resultados?.length>0?
						<table className="table">
							<thead>
								<tr>
									<th scope="col">UserName</th>
									<th scope="col">Nombre</th>
									<th scope="col">Tipo de usuario</th>
								</tr>
							</thead>
							<tbody>
								{
									this.state.resultados?.map(resultado=>{
										return(
											<tr className="selectable" onClick={()=>this.handleSelectUserModify(resultado)}>
												<td >{resultado.nombreUsuario}</td>
												<td >{resultado.nombreCompleto}</td>
												<td >{resultado.nombreTipoUsuario}</td>
											</tr>
										)
									})
								}
							</tbody>
						</table>
						:
						""
						}
					</div>
					<div className="col-sm-12 col-md-12 col-lg-6 col-xl-6 scrollable adjust-100">
						{
							this.state.usuario?.tipoUsuario>0?
							<Register 
							usuario ={this.state.usuario}
							isLogged={this.props.isLogged}
							tipoUsuario={this.props.tipoUsuario}
							idVcc ={this.props.idVcc}
							title={"Modificar"} isEditable={true}
							resetAll = {this.resetAll}
							id = {this.props.id}
							/>	
							:
							<div className="usr-not-selected">
								{
									this.state.resultados.length==0?
									<h1 className="text-center"> Busca a un usuario</h1>
									:
									<h1 className="text-center"> Selecciona un usuario usuario</h1>
								}
							</div>

						}
					</div>
				</div>
					
			
				
		</div>
	
		
	</div>
	
	)
	return(
		<div className="text-center h-100">
			<h1 className="mt-5">¡No tienes los permisos para visualizar esta ventana!</h1>
			<p>Debes ser Administrador o un rango más arriba para poder entrar aquí</p>
		</div>
	)
	}
	
}