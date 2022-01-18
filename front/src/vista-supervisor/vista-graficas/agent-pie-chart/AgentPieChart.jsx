import React, {Component} from "react";
import Chart from "react-google-charts";
import {formatDateFromMls} from "../../../enviroment/Methods"
import "./agent-pie-chart.css";

export default class AgentPieChart extends Component{
    constructor(props){
        super(props);
    }
    
    
    render(){
        if(this.props.agente?.tiempos == undefined || this.props.agente?.tiempos?.length ===0){
            return(
                <div>Cargando Datos</div>
                )
            }
        // console.log("agente: ", this.props.agente.tiempos[0].milliseconds)
        const times = [
            ['Estado', 'Tiempo']
        ]
        const barsColors=[]
        const estados = []
        const timesAgente = this.props.agente?.tiempos;
        for(let index = 0; index < timesAgente.length; index++){
            const time = timesAgente[index];
            const indexState = estados.findIndex(estado =>estado?.nombre==time.estado);
            if(typeof time.milliseconds != "number"){
                console.log("different time: ", time.milliseconds)
            }
            if(indexState === -1){
                estados.push({
                    nombre: time.estado,
                    totalTime: time.milliseconds
                })
            }else{
                estados[indexState].totalTime += time.milliseconds
            }
        }
        estados.forEach((estado, index)=>{
            times.push([
                `${estado.nombre} (${formatDateFromMls(estado.totalTime)})`
                , estado.totalTime
            ]);
            const indexColor = this.props.barsColors?.findIndex(color=>color.estado == estado.nombre);
            barsColors.push(this.props.barsColors[indexColor]?.color)

        })
        // console.log("colors: ", barsColors, "set colors: ", this.props.barsColors)
        const lastState = this.props.agente?.tiempos[0];
        let labelLastState;
        if(lastState){
            const elemLastState = estados.find(estado=> lastState.estado == estado.nombre);
            // console.log("Last state: ", elemLastState)
            labelLastState = this.props.isToday?`Estado actual: ${elemLastState?.nombre} (${formatDateFromMls(elemLastState?.totalTime)})`:"";
        }else{
            return(
                <div>Cargando Datos</div>
                )
            }
        this.props.setData(times);
        return(
            <div className="pie-chart">
                {
                    this.props.ready?
                    <p className="text-center h5">{this.props.agente?.nombre}</p>
                    :
                    ""
                }
                <Chart 
                    width={'100%'}
                    height={"300px"}
                    chartType="PieChart"
                    loader={<div>Cargando gráfica</div>}
                    options={{
                        title: this.props.isToday?labelLastState:null,
                        colors: barsColors
                    }}
                    data={times}
                    chartEvents={[
                        {
                            eventName:"ready",
                            callback: this.props.handleReadyChart
                        }
                    ]}
                />
            </div>
        )
    }
}