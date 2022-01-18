import React, {Component} from "react";
import Chart from "react-google-charts"

import "./timeline.css"
export default class Timeline extends Component{
    constructor(props){
        super(props);
    }
    render(){
            const tiempos=[
                [
                    { type: 'string', id: 'Nombre' },
                    { type: 'string', id: 'Estado' },
                    { type: 'date', id: 'Start' },
                    { type: 'date', id: 'End' },
                ]
            ]
            this.props.agente?.tiempos?.forEach(tiempo=>{
                const nombre = this.props.agente?.nombre;
                    tiempos.push([
                        nombre,
                        tiempo.estado,
                        tiempo.start,
                        tiempo.end
                    ])
                })
            if(tiempos.length>1)
                return(
                        <div className="timeline">
                            {
                                this.props.ready?
                                <p className="text-center h5">{this.props.agente?.nombre}</p>
                                :
                                ""
                            }
                            <Chart 
                                width={'100%'}
                                height={'100px'}
                                chartType="Timeline"
                                loader={<div>Cargando Gráfica</div>}
                                data={tiempos}
                                options={{
                                    allowHtml: true,
                                    timeline: { showRowLabels: false },
                                    colors: this.props.barsColors
                                } }
                                chartEvents={[
                                    {
                                        eventName:"ready",
                                        callback: this.props.handleReadyChart
                                    }
                                ]}
                                />
                        </div>
                )
                
            return(
                <div>Cargando Datos</div>
            )
    }
}