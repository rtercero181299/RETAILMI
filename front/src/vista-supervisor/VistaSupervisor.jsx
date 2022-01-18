import React, { Component } from "react";
import { CSVLink } from "react-csv";
import "./vista-supervisor.css";

import { API } from "../enviroment/Credentials";
import { hora, morning, outTime, workHours } from "../enviroment/Constants";
import SelectView from "./select-view/SelectView";
import InputFecha from "./input-fecha/InputFecha";
import VistaGraficas from "./vista-graficas/VistaGraficas";
import moment from "moment";
import "moment/locale/es";
import { formatDateFromMls, getDateDifference } from "../enviroment/Methods";
moment.locale("es");
export default class VistaSupervisor extends Component {
    constructor(props) {
        super(props);
        this.state = {
            vista: 1,
            fechaInicio: undefined,
            fechaFin: undefined,
            dias: [],
            agentes: [],
            agentesPasados: [],
            estados: [],
            colors: [],
            isToday: true,
            diasElegidos: [],
            diaVista: moment(new Date()).format("DD/MM/yyyy"),
            data: [],
            reporteGeneral: {},
            isHistoric: false,
            historicRange: ""
        }
        this.interval = 0;
        this.handleChangeVista = this.handleChangeVista.bind(this)
        this.handleChangeFechaInicio = this.handleChangeFechaInicio.bind(this);
        this.handleChangeFechaFin = this.handleChangeFechaFin.bind(this);
        this.handleClickHistorico = this.handleClickHistorico.bind(this);
        this.handleClickHistoricoGeneral = this.handleClickHistoricoGeneral.bind(this);
        this.handleChangeDiaElegido = this.handleChangeDiaElegido.bind(this)
        this.getData = this.getData.bind(this);
        this.handleClickRealTime = this.handleClickRealTime.bind(this);
        this.setGeneralData = this.setGeneralData.bind(this);
        this.getDataReport = this.getDataReport.bind(this);
        this.barsColors = [
            "#850780", //morado
            "#4109B0", //azul
            "#128217",//verde
            "#F7E414", //amarillo
            "#E8510C", //naranja
            "#F51000", //rojo
            "#E60B7B", //rosa
            "#0EF8FA", //azul cielo
            "#994F05", //café
            "#000000", //negro
        ]
        this.graficas = undefined;
        this.data = [];
    }
    getDataReport() {
        this.setState({ data: this.data });
    }
    componentDidMount() {
        this.getData();
        if (this.state.isToday) {
            this.props.socket.on("fechas-enviadas", data => {
                const agentes = this.state.agentes;
                const indexAgente = agentes.findIndex(ag => ag.id == data.idAgente);
                const now = new Date();
                if (indexAgente !== -1) {
                    if (!data.tiempos) {
                        agentes[indexAgente].tiempos = [{
                            estado: "Desconectado",
                            start: morning,
                            end: now,
                            milliseconds: now.getTime() - morning.getTime()
                        }]
                    } else {
                        agentes[indexAgente].tiempos = data.tiempos.map((time, index, array) => {
                            const end = index == 0 ? now : new Date(array[index - 1].fechaInicio);
                            const start = new Date(time.fechaInicio);
                            return ({
                                start: start,
                                estado: time.nombre,
                                end: end,
                                milliseconds: end.getTime() - start.getTime()
                            })
                        })
                    }
                    this.setState({ agentes: agentes })
                }
            })
            this.props.socket.on("user-change-state", nuevoEstado => {
                const agentes = this.state.agentes;
                const indexAgente = agentes.findIndex(ag => ag.id == nuevoEstado.idUsuario);
                if (indexAgente !== -1) {
                    const start = new Date(nuevoEstado.fechaInicio);
                    const end = new Date();
                    agentes[indexAgente].tiempos.unshift({
                        start: start,
                        estado: nuevoEstado.nombre,
                        end: end,
                        milliseconds: end.getTime() - start.getTime()
                    })
                    this.setState({ agentes: agentes })
                    if (this.state.vista == 1) {
                        // console.log(this.graficas);
                        this.graficas?.forceUpdate();
                    }
                    // console.log("se actualizan agentes: ", nuevoEstado);
                } else {
                    console.log("no se encuentra el usuario que cambió de estado: ", nuevoEstado)
                }
            })
            this.interval = setInterval(() => {
                const agentes = this.state.agentes;
                agentes.forEach(agc => {
                    const start = new Date(morning)
                    if (agc.tiempos?.length > 0) {
                        const endNow = new Date();
                        const lastStart = new Date(agc.tiempos[0].start);
                        agc.tiempos[0].end = endNow;
                        agc.tiempos[0].milliseconds = endNow.getTime() - lastStart.getTime();
                        if (agc.tiempos[agc.tiempos.length - 1].start > morning) {
                            const end = new Date(agc.tiempos[agc.tiempos.length - 1].start)
                            agc.tiempos.push({
                                estado: "Desconectado",
                                start: start,
                                end: end,
                                milliseconds: end.getTime() - start.getTime()
                            })
                        }
                    } else {
                        agc.tiempos = [
                            {
                                estado: "Desconectado",
                                start: start,
                                end: new Date(),
                                milliseconds: new Date().getTime() - start.getTime()
                            }
                        ]
                    }
                })
                this.setState({
                    agentes: agentes
                })
            }, 1000)
        }
    }
    handleChangeVista(option) {
        this.setState({ vista: option })
    }
    handleChangeFechaInicio(fecha) {
        const fechaInicio = new Date(fecha)
        fechaInicio.setHours(0, 0, 0, 0)
        this.setState({ fechaInicio: fechaInicio })
    }
    handleChangeFechaFin(fecha) {
        const fechaFin = new Date(fecha)
        this.setState({ fechaFin: fechaFin })
    }
    setGeneralData(data) {
        switch (this.state.vista) {
            case 1: {
                this.data = [['Agente', ...this.state.estados?.map(estado => estado.nombre)]]
                const dataBarChartAg = data.dataBarChartAg;
                dataBarChartAg.forEach(({ agente, data }) => {
                    const tiemposAgente = this.state.estados?.map(estado => {
                        const time = data.find(edo => edo[0].toLocaleLowerCase().includes(estado.nombre.toLocaleLowerCase()))
                        return formatDateFromMls(time ? time[1] : 0);
                    });
                    this.data.push([agente.nombre, ...tiemposAgente]);
                })
                break;
            }
            case 2: {
                this.data = [['Agente', ...this.state.estados?.map(estado => estado.nombre)]]
                const dataPieChartAg = data.dataPieChartAg;
                dataPieChartAg.forEach(({ agente, data }) => {
                    const tiemposAgente = this.state.estados?.map(estado => {
                        const time = data.find(edo => edo[0].toLocaleLowerCase().includes(estado.nombre.toLocaleLowerCase()))
                        return time ? time[1] : 0;
                    });
                    this.data.push([agente.nombre, ...tiemposAgente]);
                })
                break;
            }
            case 3: {
                const dataPieChartSt = data.dataPieChartSt;
                this.data = [];
                dataPieChartSt.forEach(({ nombre, agentes }) => {
                    // const totalTime = agentes.reduce((total, now)=>{
                    //     if(isNaN(parseInt(now[1]))) return total;
                    //     return total + now[1];
                    // })
                    this.data.push(['Estado: ', nombre])
                    if (agentes.length == 1) {
                        this.data.push(["No se ", "registró"])

                    } else {
                        this.data.push(...agentes)
                    }
                })
                // dataPieChartSt = dataPieChartSt.filter(agente=>!agente[0].includes('Agente'));
                // console.log("data states", dataPieChartSt);
                break;
            }
            default: {
                this.data = [];
                break;
            }
        }
        // console.log("data for: ",this.state.vista ,this.data);
    }
    async getData() {
        const options = {
            method: "post",
            mode: "cors",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ idSupervisor: this.props.id })
        }
        const response = await fetch(API.LIST_AGENTES, options).catch(error => console.log("error al listar los agentes: ", error));
        if (response) {
            let data = await response.json();
            this.setState({ agentes: data })
        }
        const optionsEstados = {
            method: "post",
            mode: "cors",
            headers: {
                "Content-Type": "application/json"

            }
        }
        const responseEstados = await fetch(API.LIST_ESTADOS_VALUES, optionsEstados);
        const estados = await responseEstados.json().catch(error => console.log("error al consultar los estados", error));
        if (estados) {
            let estadosCon = [];
            let colors = [];
            estados.forEach((estado, index) => {
                if (estado.estadosIdCat_Name.toLocaleLowerCase() == "out") return;
                estadosCon.push({
                    id: estado.estadosIdCat_Id,
                    nombre: estado.estadosIdCat_Name,
                    agentes: [['Agente', "Tiempo"]]
                })
                colors.push(
                    { color: this.barsColors[index % this.barsColors.length], estado: estado.estadosIdCat_Name }
                )
            })
            this.setState({ estados: estadosCon, colors: colors });
        }
    }
    async handleClickHistorico() {
        const fechaFin = this.state.fechaFin || new Date(this.state.fechaInicio);
        fechaFin.setHours(23, 59, 59, 999)
        const options = {
            method: "post",
            mode: "cors",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                idSupervisor: this.props.id,
                fechaInicio: this.state.fechaInicio,
                fechaFin: fechaFin
            })
        }
        // console.log("options: ", options)    
        const response = await fetch(API.GET_HISTORIC, options).catch(error => console.log("ocurrió un error al obtener los tiempos", error));
        if (response) {
            const data = await response.json().catch(error => console.log("error al parsear los datos", error));
            if (data) {
                // console.log("data: ", data);
                const agents = this.state.agentes
                agents?.forEach(agt => agt.tiempos = []);
                // console.log("agentes: ", agents);
                let fecha = new Date(this.state.fechaInicio);
                const dias = [], diasElegidos = []
                while (fecha <= fechaFin && agents) {
                    const stringFecha = moment(fecha);
                    stringFecha.locale("es");
                    const dataDia = data.filter(time => {
                        const timeDate = new Date(time.fechaInicio);
                        return (
                            timeDate.getDate() == fecha.getDate() &&
                            timeDate.getMonth() == fecha.getMonth())
                    })
                    const dia = {
                        date: new Date(fecha),
                        data: dataDia,
                        agentes: agents?.map(agente => {
                            const tiempos = dataDia.filter(dia => dia.userId == agente.id).
                                sort((firts, second) => second.fechaInicio - firts.fechaInicio)
                            // console.log("building agent, times: ", tiempos);
                            const agenteWithTimes = {
                                ...agente,
                                tiempos: tiempos.length > 0 ?
                                    tiempos?.map((tiempo, index) => {
                                        const start = new Date(tiempo.fechaInicio);
                                        let end;
                                        if (index == 0) {
                                            end = new Date(tiempo.fechaInicio);
                                            if (start.getHours() >= outTime.getHours() &&
                                                start.getMinutes() >= outTime.getMinutes()) {
                                                end.setHours(23, 59, 59, 59);
                                            } else {
                                                end.setHours(outTime.getHours(), 0, 0, 0);
                                            }
                                        } else {
                                            end = new Date(tiempos[index - 1].fechaInicio);
                                        }
                                        return ({
                                            start: start,
                                            estado: tiempo.estado,
                                            end: end,
                                            milliseconds: end.getTime() - start.getTime()
                                        })
                                    }) : []
                            }
                            // console.log("Agente construido: ", agenteWithTimes);
                            return agenteWithTimes
                        })
                    }
                    // console.log("Dia construido: ", dia);
                    diasElegidos.push((stringFecha.dayOfYear() == moment(new Date()).dayOfYear() ? "(hoy)" : "") + stringFecha.format("dddd DD/MM/yyyy"));
                    dias.push(dia);
                    fecha.setTime(fecha.getTime() + 24 * hora)
                }
                // console.log("dias: ", dias);
                const reporteGeneral = {
                    agentes: []
                }
                dias.forEach((dia, index) => {
                    dia.agentes.forEach(agente => {
                        const indexAgente = reporteGeneral.agentes?.findIndex(agt => {
                            return agt.id == agente.id
                        });
                        if (indexAgente !== -1) {
                            reporteGeneral.agentes[indexAgente].tiempos = reporteGeneral.agentes[indexAgente].tiempos.concat(agente.tiempos);
                        } else {
                            reporteGeneral.agentes.push(agente);
                        }
                    })
                })
                // diasElegidos.unshift("REPORTE GENERAL")
                // dias.unshift(reporteGeneral)
                // console.log("dias: ", dias);
                this.setState({
                    dias: dias,
                    diasElegidos: diasElegidos,
                    reporteGeneral: reporteGeneral
                })
                this.handleChangeDiaElegido(1);
            }
        }


    }
    handleClickHistoricoGeneral() {
        // console.log("click con historico general, historico: ", this.state.reporteGeneral);
        clearInterval(this.interval);
        this.interval = 0;
        const historicRange = moment(this.state.fechaInicio).format("DD/MM/yyyy") + "-" + moment(this.state.fechaFin).format("DD/MM/yyyy")
        this.setState({ isHistoric : true, historicRange:historicRange });
        const agentes = this.state.reporteGeneral?.agentes;
        const start = new Date(this.state.fechaInicio);
        const end = new Date(this.state.fechaFin);
        start.setHours(9, 0, 0, 0);
        end.setHours(19, 0, 0, 0)
        agentes.forEach(agente => {
            if (agente.tiempos?.length == 0) {
                agente.tiempos.push({
                    start: start,
                    estado: "Desconectado",
                    end: end,
                    milliseconds: end.getTime() - start.getTime()
                })
            } else {
                const lastTime = new Date(agente.tiempos[agente.tiempos?.length - 1].end);
                if (!(lastTime.getDate() == end.getDate()) ||
                    !(lastTime.getMonth() == end.getMonth())) {
                    const horasRestantes = end.getHours()- lastTime.getHours();
                    lastTime.setDate(lastTime.getDate()+1);
                    lastTime.setHours(9,0, 0, 0)
                    console.log("lastTime: ", lastTime);
                    console.log("end: ", end);
                    const diasDiferencia = getDateDifference(lastTime, end)
                    console.log("dias de diferencia: ", diasDiferencia);
                    const horasLaborales =  diasDiferencia* workHours;
                    agente.tiempos.push({
                        start: lastTime,
                        estado: "Desconectado",
                        end: end,
                        milliseconds: hora *(horasLaborales +horasRestantes)
                    })
                }
            }
        })
        // console.log("agentes: ", agentes);
        this.setState({ agentesPasados: agentes, isToday: false });
    }

    handleChangeDiaElegido(dia) {
        if ((!dia) || dia == 0) { return }
        const indexDia = dia - 1;
        const fecha = this.state.dias[indexDia].date;
        this.setState({ diaVista: moment(fecha).format("DD/MM/yyyy"), isHistoric: false });
        // console.log("dia: ", this.state.dias[indexDia]);
        const today = new Date();
        if (indexDia >= 0) {
            if (today.getDate() == fecha.getDate() &&
                today.getMonth() == fecha.getMonth()) {
                // console.log("is today");
                this.handleClickRealTime();
                return;
            }
            clearInterval(this.interval);
            this.interval = 0;
            const agentes = this.state.dias[indexDia].agentes;
            agentes.forEach(agente => {
                if (agente.tiempos?.length == 0) {
                    const start = new Date(fecha);
                    const end = new Date(fecha);
                    start.setHours(9, 0, 0, 0);
                    end.setHours(19, 0, 0, 0)
                    agente.tiempos.push({
                        start: start,
                        estado: "Desconectado",
                        end: end,
                        milliseconds: end.getTime() - start.getTime()
                    })
                }
            })
            // console.log("agentes: ", agentes);
            this.setState({ agentesPasados: agentes, isToday: false });
        }
    }

    componentWillUnmount() {
        clearInterval(this.interval);
        this.interval = 0;
    }
    handleClickRealTime() {
        this.setState({ isToday: true , diaVista: moment(new Date()).format("DD/MM/yyyy")});
        if (this.interval === 0) {
            this.interval = setInterval(() => {
                const agentes = this.state.agentes;
                agentes.forEach(agc => {
                    const start = new Date(morning)
                    if (agc.tiempos?.length > 0) {
                        const endNow = new Date();
                        const lastStart = new Date(agc.tiempos[0].start);
                        agc.tiempos[0].end = endNow;
                        agc.tiempos[0].milliseconds = endNow.getTime() - lastStart.getTime();
                        if (agc.tiempos[agc.tiempos.length - 1].start > morning) {
                            const end = new Date(agc.tiempos[agc.tiempos.length - 1].start)
                            agc.tiempos.push({
                                estado: "Desconectado",
                                start: start,
                                end: end,
                                milliseconds: end.getTime() - start.getTime()
                            })
                        }
                    } else {
                        agc.tiempos = [
                            {
                                estado: "Desconectado",
                                start: start,
                                end: new Date(),
                                milliseconds: new Date().getTime() - start.getTime()
                            }
                        ]
                    }
                })
                this.setState({
                    agentes: agentes
                })
            }, 1000)
        }
    }
    render() {
        return (
            <div className="vista-supervisor ">
                <div className="controls row">
                    <div className="row">
                        <div className="col-sm-12 col-md-12 col-lg-8 col-xl-8">
                            <div className="row">
                                <div className="col-sm-12 col-md-6 col-lg-6 col-xl-6">
                                    <SelectView
                                        title="Seleccionar vista"
                                        options={['Tiempos por agente (barras)', 'Tiempos por agente', 'Tiempos por estado']}
                                        onChange={this.handleChangeVista}
                                    />
                                </div>
                                <div className="col-sm-12 col-md-12 col-lg-6 col-xl-6">
                                    {
                                        this.state.diasElegidos?.length > 0 ?
                                            <SelectView
                                                title="Seleccionar dia"
                                                options={this.state.diasElegidos}
                                                onChange={this.handleChangeDiaElegido}
                                            />
                                            :
                                            ""
                                    }
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-sm-12 col-md-12 col-lg-6 col-xl-6" >
                                    <InputFecha
                                        tipo="inicio"
                                        label="Desde"
                                        onChange={this.handleChangeFechaInicio}
                                        maxDate={this.state.fechaFin}
                                    />
                                </div>
                                <div className="col-sm-12 col-md-12 col-lg-6 col-xl-6">
                                    <InputFecha
                                        tipo="fin"
                                        label="Hasta"
                                        minDate={this.state.fechaInicio}
                                        onChange={this.handleChangeFechaFin}
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="col-sm-12 col-md-12 col-lg-4 col-xl-4">
                            <div className="col-sm-12 col-md-12 col-lg-12 col-xl-12 d-flex justify-content-center align-items-center">
                                <div className="col-6 justify-content-center align-items-center p-1 d-flex">
                                    {
                                        this.state.fechaInicio ?
                                            <a onClick={this.handleClickHistorico} className="btn btn-primary mr-2">Ver reporte</a>
                                            : ""
                                    }
                                </div>
                                <div className="col-6 justify-content-center align-items-center p-1 d-flex">
                                    <CSVLink
                                        className="btn btn-primary ms-2"
                                        data={this.state.data}
                                        onClick={this.getDataReport}
                                        target="_blank"
                                        filename={`Reporte-${this.state.vista == 1 || this.state.vista == 2 ? "Estados por agente" : "Estados Registrados"}-${this.state.isHistoric ? "REPORTE-HISTORICO-" + this.state.historicRange : this.state.diaVista}.csv`}
                                    >Descargar Reporte</CSVLink>

                                </div>
                            </div>
                            <div className="col-sm-12 col-md-12 col-lg-12 col-xl-12 d-flex justify-content-center align-items-center">
                                <div className="col-6 justify-content-center align-items-center p-1 d-flex">
                                    {
                                        this.state.isToday ?
                                            null
                                            :
                                            <a onClick={this.handleClickRealTime} className="btn btn-primary ms-2">Ver tiempo real</a>
                                    }
                                </div>
                                <div className="col-6 justify-content-center align-items-center p-1 d-flex">
                                    {
                                        this.state.dias.length > 1 ?
                                            <a onClick={this.handleClickHistoricoGeneral} className="btn btn-primary mr-2">Ver reporte general</a>
                                            : ""
                                    }
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                {
                    this.state.agentes?.length > 0 ?
                        <VistaGraficas
                            ref={this.graficas}
                            userName={this.props.userName}
                            id={this.props.id}
                            socket={this.props.socket}
                            vista={this.state.vista}
                            setActualInterval={(val) => this.interval = val}
                            agentes={this.state.isToday ? this.state.agentes : this.state.agentesPasados}
                            estados={this.state.estados}
                            colors={this.state.colors}
                            isToday={this.state.isToday}
                            agentesPasados={this.state.agentesPasados}
                            setGeneralData={this.setGeneralData}
                        />
                        :
                        ""
                }
            </div>
        )
    }
}