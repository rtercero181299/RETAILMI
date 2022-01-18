import React, {Component} from "react";
//assets
import { API } from "../enviroment/Credentials.js";
import {ImHeadphones} from "react-icons/im"
import "./vistausuario.css";
import { formatDateFromMls } from "../enviroment/Methods.js";

export default class VistaUsuario extends Component{
    constructor (props){
        super(props);
        this.state={
            arreEst:[],
            active: -1,
            cp: ""
        }
        //Suscribir al contexto de la clase
        this.handleClick = this.handleClick.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.getData = this.getData.bind(this);
        this.miliSeg = formatDateFromMls;
        this.recuperarTiempos = this.recuperarTiempos.bind (this);
        this.handleChangeCp = this.handleChangeCp.bind(this);
        this.handleClickValidarCp = this.handleClickValidarCp.bind(this);
    }

    componentDidMount(){
        this.getData();
    }

    async getData(){
		const options = {
			method:"post",
			mode: "cors",
            headers:{
                "Content-Type": "application/json"

            }
		}


        //Petición de datos tipo POST
        const resultado = await fetch(API.LIST_ESTADOS_VALUES, options);
        const data = await resultado.json();
        

        let arrayTemp =this.state.arreEst;

        data.forEach((estado, index)=>{
            if(estado.estadosIdCat_Name.toLocaleLowerCase()=="out")return;
            // if (index == 0){
            //     this.setState({active : estado.estadosIdCat_Id})
            // }
            arrayTemp[index] = {
                id: estado.estadosIdCat_Id,
                nombre: estado.estadosIdCat_Name,
                intervalo: -1,
                time:  0
            }
        })

        this.setState({arreEst: arrayTemp})
        this.recuperarTiempos();
    }

//Recuperar datos del server
    recuperarTiempos(){
        this.props.socket.emit("obtener-estados", this.props.id)
        this.props.socket.on("fechas-enviadas", data=>{
            if (this.state.arreEst.some(est=>est.intervalo!=-1)){
                const timers = this.state.arreEst.filter(est=>est.intervalo!=-1);{
                    timers.forEach(tim=>clearInterval(tim.intervalo));
                }
            }
            const tiempos = data.tiempos;
            console.log("Tiempos", tiempos)

            let arreEst=this.state.arreEst;
            const fechaMls = Date.now(); 
            if(tiempos.length==0){
                const posicion =  arreEst.findIndex(estado=>estado.nombre == "Disponible");
                this.handleClick(posicion)
            }
        
            tiempos.forEach((elem, index, array)=>{
                const tiempo = new Date(elem.fechaInicio)
                const tiempoMls = tiempo.getTime()
                let posicion = arreEst.findIndex(estado=>estado.id==elem.idEstado);
                if(index===0){
                    if(elem.nombre == "Desconectado"){
                       posicion =  arreEst.findIndex(estado=>estado.nombre == "Disponible");
                       this.handleClick(posicion)
                    }
                    arreEst[posicion].time=arreEst[posicion].time+(fechaMls-tiempoMls);
                    if(arreEst[posicion].intervalo!== -1){
                        clearInterval(arreEst[posicion].intervalo);
                    }
                    arreEst[posicion].intervalo = setInterval(()=>{
                        arreEst[posicion].time = arreEst[posicion].time+1000;
                        this.setState({arreEst: arreEst})     
                    }, 1000);
                    this.setState({active: arreEst[posicion].id})
                }else{
                    const fecha = new Date(array[index-1].fechaInicio)
                    const dateMls = fecha.getTime()
                  arreEst[posicion].time=arreEst[posicion].time+(dateMls-tiempoMls);
              }
            })
            this.setState({arreEst:arreEst})
        })

    }
    


    handleClick(index){
        let arrayTemp =this.state.arreEst;
        const estado =  arrayTemp[index];
        const activo = arrayTemp.findIndex(elem=>elem.intervalo!==-1);
        this.setState({active: estado.id})
        if(activo>=0){
            clearInterval(arrayTemp[activo].intervalo);
            arrayTemp[activo].intervalo = -1;
        }
        arrayTemp[index].intervalo= setInterval(()=>{
            arrayTemp[index].time = arrayTemp[index].time+1000;
            this.setState({arreEst: arrayTemp})     
        }, 1000);
       this.props.socket.emit("cambio-estado", {
           idUsuario: this.props.id, 
           idEstado: estado.id,
           fechaInicio:  new Date(),
           nombre: estado.nombre
       })
    }

        handleSubmit(){
            let arrayTemp =this.state.arreEst;
            arrayTemp.forEach((estado)=>{
                if(estado.intervalo!==-1){
                    clearInterval(estado.intervalo);
                    estado.intervalo=-1;
                }

           })
           this.setState({arreEst:arrayTemp});
        }

        handleChangeCp(event){
            this.setState({cp: event.target.value})
        }
        async handleClickValidarCp(){
            const options = {
                method:"post",
                mode: "cors",
                headers:{
                    "Content-Type": "application/json"
    
                },
                body: JSON.stringify({cp: this.state.cp})
            }
    
    
            //Petición de datos tipo POST
            const resultado = await fetch(API.VALIDAR_CP, options);
            const data = await resultado.json();
            if(data.correct == true){
                alert("Es correcto")
            }else{
                alert("No es correcto")
            }
        }
    render(){
        return(
            
            <div className="hvh-100 w-100 d-flex justify-content-start flex-column">
            <h1 className="text-center dispaly-6 m-5"> Agente: {this.props.userName}  </h1>
            
            
            <div className="row">
            <div className="col-sm-12 col-md-6 col-lg-6 col-xl-6">
                    
             {
                 this.state.arreEst?.map((elem, index)=>{
                     return elem.nombre != "Desconectado"?
                     <div className="col-sm-12 col-md-6 col-lg-6 col-xl-6" key={index}>
                            <div className="form-group d-flex mt-1">
                                <a className={`btn ${this.state.active==elem.id?"btn-success":"btn-primary"} left form-control`} role="button" onClick={()=>this.handleClick(index)} value="Estados" > {
                                    elem.nombre
                                } </a>
                                <label className="ml-2">  {this.miliSeg(elem.time)}   </label>  
                            </div>
                        </div>
                        :
                        ""
                    })
                }
                </div>
                
                <div className="col-sm-12 col-md-6 col-lg-4 col-xl-4 d-flex align-items-center justify-content-center flex-end">
                    <div className="row">
                        <div className="form-floating">
                            <input id="cp" type="number" value={this.state.cp} onChange={this.handleChangeCp} className="form-control" />
                            <label htmlFor="cp"> Validar CP</label>
                        </div>
                            <a rel="noreferrer" href="https://ardabytec.vip/" target="_blank" className="mt-1 w-50 btn btn-outline-info go-to-vicidial"> Ir a vicidial <ImHeadphones/></a>
                            <a onClick={this.handleClickValidarCp} className="mt-1 w-50 btn btn-primary"> Validar</a>
                    </div>
                </div>
            </div>
            </div>
        )
    }

}