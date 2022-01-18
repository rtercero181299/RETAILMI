import React, { Component } from "react";
import Chart from "react-google-charts";
import { formatDateFromMls, getHMSMSfromMls } from "../../../enviroment/Methods"
import {
    hora, workHours,
    //  morning, segundo, worktime
} from "../../../enviroment/Constants"
import "./agent-bar-chart.css";

export default class AgentBarChart extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        if (this.props.agente?.tiempos == undefined || this.props.agente?.tiempos?.length === 0 || typeof this.props.barsColors !== "object") {
            return (
                <div>Cargando Datos</div>
            )
        }

        // const worktimeMls =worktime.getHours()* hora  + worktime.getMinutes()* worktime + morning.getSeconds()* segundo;
        const times = [
            ['Estado', 'Tiempo', { role: 'style' }],
            // ['', worktimeMls,"#FFFFFF"]
        ]
        const estados = []
        const timesAgente = this.props.agente?.tiempos;
        let maxTime = 0;
        for (let index = 0; index < timesAgente.length; index++) {
            const time = timesAgente[index];
            const indexState = estados.findIndex(estado => estado?.nombre == time.estado);
            if (typeof time.milliseconds != "number") {
                console.log("different time: ", time.milliseconds)
            }
            if (indexState === -1) {
                estados.push({
                    nombre: time.estado,
                    totalTime: time.milliseconds
                })
                // console.log("height changed", heightGrafica);
            } else {
                estados[indexState].totalTime += time.milliseconds
            }
        }
        estados.forEach((estado, index) => {
            const totalTime = new Date();
            const formated = getHMSMSfromMls(estado.totalTime);
            totalTime.setHours(...formated);
            const indexColor = this.props.barsColors?.findIndex(color => color.estado == estado.nombre);
            times.push([
                `${estado.nombre} (${formatDateFromMls(estado.totalTime)})`
                , estado.totalTime, this.props.barsColors[indexColor]?.color
            ]);
            if (maxTime < parseInt(estado.totalTime / hora)) {
                // console.log("new maxstate: ", estado, "of ", this.props.agente?.nombre);
                maxTime = parseInt(estado.totalTime / hora);
                // console.log("maxtime: ", maxTime, "of ", this.props.agente?.nombre);
            }
            // console.log("color: ", this.props.barsColors); 
            // barsColors.push(this.props.barsColors[indexColor]?.color)

        })
        // console.log("colors: ", barsColors, "set colors: ", this.props.barsColors)
        const lastState = this.props.agente?.tiempos[0];
        let labelLastState;
        if (lastState) {
            const elemLastState = estados.find(estado => lastState.estado == estado.nombre);
            // console.log("Last state: ", elemLastState)
            labelLastState = this.props.isToday ? `Estado actual: ${elemLastState?.nombre} (${formatDateFromMls(elemLastState?.totalTime)})` : "";
            this.props.setData(times);
        } else {
            return (
                <div>Cargando Datos</div>
            )
        }
        // console.log("times: ", times);
        let maxDaysTime = 0, maxWeeksTime= 0;
        if (maxTime > workHours) {
            maxDaysTime = Math.ceil(maxTime / workHours) + 1;
            if (maxDaysTime>21){
                maxWeeksTime = Math.ceil(maxDaysTime / 5) + 1;
            }
        }
        return (
            <div className="pie-chart" >
                {
                    this.props.ready ?
                        <p className="text-center h5">{this.props.agente?.nombre}</p>
                        :
                        ""
                }
                <div style={{ height: (this.props.heightGrafica * 80) + 50 }}>
                    <Chart
                        width={'100%'}
                        height={`100%`}
                        chartType="BarChart"
                        loader={<div>Cargando gráfica</div>}
                        options={{
                            title: this.props.isToday ? labelLastState : null,
                            legend: "none",
                            hAxis: {
                                ticks: maxTime > workHours ?
                                    maxDaysTime + 1 > 21 ?
                                        [...Array(maxWeeksTime)].map((elem, index) => (
                                            { v: hora * workHours* 7 * (index), f: `${index < 10 ? `0${index}` : index} semana${index != 1 ? "s" : ""}` }
                                        )
                                        )
                                        :
                                        [...Array(maxDaysTime)].map((elem, index) => (
                                            { v: hora * workHours * (index), f: `${index < 10 ? `0${index}` : index} dia${index != 1 ? "s" : ""}` }
                                        )
                                        )
                                    : [...Array(maxTime + 2)].map((elem, index) => ({ v: hora * (index), f: `${index < 10 ? `0${index}` : index}:00:00` })
                                    )
                            },
                            vAxis: {
                                textStyle: {
                                    fontSize: "10px"
                                },
                                minValue: {

                                }
                            },
                        }}
                        left="100px"
                        data={times}
                        chartEvents={[
                            {
                                eventName: "ready",
                                callback: this.props.handleReadyChart
                            }
                        ]}
                    />
                </div>
            </div>
        )
    }
}