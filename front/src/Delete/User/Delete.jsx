//modulos
import React, {Component} from "react";
import { Redirect } from "react-router";

//assets
import "./delete.css";

//variables de ambiente
import { API } from "../../enviroment/Credentials";

/**
 * @author @AmelieCruzG
 * Componente que renderiza la vista para eliminar un usuario
 * @argument {boolean} isLogged -- estado que indica si el usuario está loggeado
 * @argument {Number | String} id -- estado que guarda el id del usuario actual
 * @argument {Socket} socket -- websocket conectado al server
 * @argument {Number | String} tipoUsuario -- estado que guarda el tipo de usuario loggeado
 * @argument {Number | String} idVcc -- estado que almacena el id del CC o compañía del usuario
 * 
 * 
 */
export default class Delete extends Component{
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
		this.handleDeleteUser = this.handleDeleteUser.bind(this);
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
					this.handleDeleteUser(searchData[0])
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
	async handleDeleteUser(usr){
		this.setState({usuario: {
			tipoUsuario: 0
		}})
		const options = {
			method:"post",
			mode: "cors",
            headers:{
                "Content-Type": "application/json"
            },
			body:JSON.stringify({
				idUsuario:usr,
				idSupervisor: this.props.id
			})
		}
		console.log("se envía: ", options);
		const resp = await fetch(API.DELETE_USER, options)
		const data = await resp.json();
		if(data.result == "correcto"){

			let resultados = this.state.resultados;
			resultados = resultados.filter(user => user.id != usr);
			this.setState({resultados: resultados});
		}else{
			alert("error al eliminar al usuario")
		}
		console.log("respuesta: ");

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
					<div className="col-sm-12 col-md-12 col-lg-12 col-xl-12">
						{this.state.resultados?.length>0?
						<table className="table">
							<thead>
								<tr>
									<th scope="col">UserName</th>
									<th scope="col">Nombre</th>
									<th scope="col">Tipo de usuario</th>
									<th scope="col">Eliminar</th>
								</tr>
							</thead>
							<tbody>
								{
									this.state.resultados?.map(resultado=>{
										return(
											<tr>
												<td >{resultado.nombreUsuario}</td>
												<td >{resultado.nombreCompleto}</td>
												<td >{resultado.nombreTipoUsuario}</td>
                                                <td> <a className="btn btn-danger" onClick={()=>this.handleDeleteUser(resultado.id)}>Eliminar</a></td>
											</tr>
										)
									})
								}
							</tbody>
						</table>
						:
						"Busca un usuario para eliminar"
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