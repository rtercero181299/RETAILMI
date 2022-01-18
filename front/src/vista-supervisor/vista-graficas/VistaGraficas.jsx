import React, {Component} from "react"

import "./vista-graficas.css";

// import Timeline from "./timeline/TimeLine.jsx";
import AgentPieChart from "./agent-pie-chart/AgentPieChart.jsx";
import AgentBarChart from "./agent-bar-chart/AgentBarChart.jsx";//src\vista-supervisor\agent-bar-chart\AgentBarChart.jsx
import StatePieChart from "./state-pie-chart/StatePieChart.jsx";


export default class VistaGraficas extends Component{
    constructor(props){
        super(props);
        this.state={
            agentes: this.props.agentes,
            ready: false,
        }
        this.data= {
            dataBarChartAg: [],
            dataPieChartAg: [],
            dataPieChartSt: []
        }
        this.getData = this.getData.bind(this);
        this.handleReadyChart = this.handleReadyChart.bind(this)
       this.setDataChart= this.setDataChart.bind(this)
    }

    componentDidMount(){
        if(this.props.isToday){
            this.getData();
        }else{
            this.setState({agentes:this.props.agentesPasados})
        }
    }
    async getData(){
        console.log("agentes: ", this.props.agentes);
        if(this.props.agentes){
            this.props.agentes?.forEach(agente => {
                this.props.socket.emit("obtener-estados", agente.id);
            });

        }
    }
    handleReadyChart(){
        if(!this.state.ready){
            this.setState({ready:true})
        }
    }
    setDataChart(data, chart){
        // console.log("data recived: ", data);
        switch(chart){
            case 1:{
                const dataChart = this.data.dataBarChartAg;
                const indexData = dataChart.findIndex(({agente})=>agente.id === data.agente.id)
                if(indexData==-1){
                    dataChart.push({agente: data.agente, data: data.data});
                }else{
                    dataChart[indexData]= {agente: data.agente, data: data.data};
                }
                // this.setState({dataBarChartAg: dataChart})
                break;
            }
            case 2:{
                const dataChart = this.data.dataPieChartAg;
                const indexData = dataChart.findIndex(({agente})=>agente.id === data.agente.id)
                if(indexData==-1){
                    dataChart.push({agente: data.agente, data: data.data});
                }else{
                    dataChart[indexData]= {agente: data.agente, data: data.data};
                }
                // this.setState({dataPieChartAg: dataChart})
                break;
            }
            case 3:{
                this.data.dataPieChartSt = data;
                break;
            }
            default:{
                this.data = {
                    dataBarChartAg: [],
                    dataPieChartAg: [],
                    dataPieChartSt: []
                }
                break;
            }
        }
        this.props.setGeneralData(this.data);
        // console.log("dataCharts: ", {barAg: this.data.dataBarChartAg, pieAg: this.data.dataPieChartAg, pieSt: this.data.dataPieChartSt});
    }
    render(){
        return(
            
                <div className="vista-supervisor-graficas pt-5 pb-5">
                    {this.props.vista==1?
                        <div >
                        {   
                        this.props.agentes?.map((agente, index)=>{
                            return(
                                <div key={index} className="col-sm-12 col-md-12-col-lg-12 col-xl-12 bar-chart">
                                    <AgentBarChart 
                                        agente = {agente}
                                        barsColors={this.props.colors}
                                        handleReadyChart={this.handleReadyChart}
                                        ready = {this.state.ready}
                                        isToday={this.props.isToday}
                                        setData= {(data)=>this.setDataChart({agente: agente, data: data}, 1)}
                                        heightGrafica = { new Set(agente?.tiempos?.map(time=>time.estado)).size}
                                        />
                                </div>
                                )
                            })
                        }
                        </div>
                    : this.props.vista ==2?
                    <div >
                            <div className="row">
                                {   
                                this.props.agentes?.map((agente,index)=>{
                                    return(
                                        <div key={index} className="col-sm-12 col-md-6-col-lg-6 col-xl-6">
                                            <AgentPieChart 
                                                setData= {(data)=>this.setDataChart({agente: agente,data: data}, 2)}
                                                agente = {agente}
                                                barsColors={this.props.colors}
                                                handleReadyChart={this.handleReadyChart}
                                                ready = {this.state.ready}
                                                isToday={this.props.isToday}
                                                />
                                        </div>
                                                
                                                )
                                            })
                                } 
                            </div>
                        </div>
                    :<StatePieChart 
                        setData= {(data)=>this.setDataChart(data, 3)}
                        agentes = {this.props.agentes}
                        estados={this.props.estados}
                        barsColors={this.props.colors}
                        isToday={this.props.isToday}
                        />
            }
                </div>
        )
        
        
    }
}
