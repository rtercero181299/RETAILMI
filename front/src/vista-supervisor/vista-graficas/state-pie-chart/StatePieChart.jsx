import React, {Component} from "react";
import Chart from "react-google-charts";
import {formatDateFromMls} from "../../../enviroment/Methods"
import "./state-pie-chart.css";

export default class StatePieChart extends Component{
    constructor(props){
        super(props);
        this.state ={
            estados: this.props.estados
        }
    }
    render(){
            if(this.props.agentes.length == undefined || this.props.estados?.length<1) 
            return(
                <div className="state-pie-chart">Cargando Datos</div>
                );
            const agentes = this.props.agentes;
            const estadosP = this.props.estados;
            const estados = estadosP.map(()=>[['Agente', 'Tiempo']]);
            agentes.forEach((agente, indexAgente)=>{
                if(agente.tiempos?.length >0){
                    const estadosAgente = []
                    const timesAgente = agente?.tiempos;
                    for(let index = 0; index < timesAgente.length; index++){
                        const time = timesAgente[index];
                        const indexState = estadosAgente.findIndex(estado =>estado?.nombre==time.estado);
                        if(typeof time.milliseconds != "number"){
                            console.log("different time: ", time.milliseconds)
                        }
                        if(indexState === -1){
                            estadosAgente.push({
                                nombre: time.estado,
                                totalTime: time.milliseconds
                            })
                        }else{
                            estadosAgente[indexState].totalTime += time.milliseconds
                        }
                    }
                    estadosAgente.forEach(estadoAgente=>{
                        const indexState = estadosP?.findIndex(estado=>estadoAgente.nombre.includes(estado.nombre));
                        if(indexState&&indexState!== -1){
                            const agents = estados[indexState] || [];
                            const indexAgent = agents?.findIndex(agt =>agt[0]?.includes(agente.nombre))
                            if(indexAgent && indexAgent!==-1){
                                agents[indexAgent]= [`${agente.nombre} (${formatDateFromMls(estadoAgente.totalTime)})`, estadoAgente.totalTime]
                            }else{
                                agents.push([`${agente.nombre} (${formatDateFromMls(estadoAgente.totalTime)})`, estadoAgente.totalTime])
                                estados[indexState] = agents;
                                if(estadosP[indexState].agentes)
                                    estadosP[indexState].agentes = agents
                            }
                        }
                    })
                }
            })
            this.props.setData(estadosP);
        return(
            <div className="state-pie-chart w-100 row">
                {
                    estados.map((estado, index)=>{
                        if(estado?.length>1)
                        return (
                            <div key={index} className={`col-sm-12 col-md-12 col-lg-6 col-xl-6`}>
                                <p className="text-center h5">{estadosP[index].nombre}</p>
                                    <Chart 
                                        width={'100%'}
                                        height={'50vh'}
                                        chartType="PieChart"
                                        loader={<div>Cargando gráfica</div>}
                                        data={estado}
                                        options={{
                                            colors:this.props.barsColors
                                        }}
                                    />
                            </div>
                        )
                        return ""
                    })
                }
                {
                    estados.map((estado, index)=>{
                        if(estado?.length<=1)
                        return (
                            <div key={index} className={`col-sm-12 col-md-12 col-lg-3 col-xl-3 d-flex align-items-center flex-column justify-content-center`}>
                                <p className="text-center h5">{estadosP[index].nombre}</p>
                                    <p className="text-center h6">
                                        No se ha registrado este estado en ningún agente
                                    </p>
                            </div>
                        )
                        return ""
                    })
                }
            </div>
        )
    }
}