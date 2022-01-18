import React, {Component} from "react";
import $ from "jquery";
import moment from "moment";
import {AiOutlineDown} from "react-icons/ai";
//calendario
import Calendar from "react-calendar";
//estilos
import "./input-fecha.css"
import 'react-calendar/dist/Calendar.css';
/**
 * Componente que ofrece un select de fecha con estilos propios
 * @onChange : funcion que comunica al padre cuando se selecciona un mes
 * @AmelieCruz
 */
export default class InputFecha extends Component{
    constructor(props){
        super(props) ;
        this.state={
            fecha: new Date(),
            showCalendar: false,
            meses : ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'],
            date: ""
        }
        this.handleClickFecha = this.handleClickFecha.bind(this);
        this.handleChangeFecha = this.handleChangeFecha.bind(this);
        this.handleChangeFechaFromCalendar = this.handleChangeFechaFromCalendar.bind(this);
    }
    
    componentDidMount(){
        $(document).on("click",(event)=>{
            if(!(
                $(event.target).parent().hasClass(`elegir-fecha`)||
                $(event.target).parent().parent().hasClass(`elegir-fecha`)||
                $(event.target).parent().parent().parent().hasClass(`elegir-fecha`)||
                $(event.target).parent().parent().hasClass(`calendar`)||
                $(event.target).parent().parent().hasClass('react-calendar'))||
                $(event.target).parent().parent().parent().parent().hasClass(`react-calendar`)||
                $(event.target).parent().parent().parent().parent().parent().hasClass(`react-calendar`)){
                this.setState({showCalendar: false})
            }
        });
    }
    handleClickFecha(){
        this.setState({showCalendar : !this.state.showCalendar});
    }
    handleChangeFecha(event = Event){
        if(event.target==undefined)return;
        else{
            let value = event.target.value
            if(isNaN(parseInt(value))) return;
            if(value.length==4 && value != "-"){
                this.setState({date: value +"-"});
            }else if(value.length==7&&value != "-"){
                this.setState({date: value +"-"});
            }else{
                this.setState({date:value});
            }
            this.props.onChange(value);
        }
    }
    handleChangeFechaFromCalendar(value){
        this.setState({date:moment(value).format("yyyy-MM-DD")});
    }
    render(){
        return(
            <div className="select-fecha">
                <div className="input-fecha">
                    <label className="label-fecha" htmlFor={"fecha-control-"+this.props.tipo}>{this.props.label}</label>
                    <button className="elegir-fecha" onClick = {this.handleClickFecha}>
                        <input id={"fecha-control-"+this.props.tipo} type="text" value = {this.state.date} onChange={this.handleChangeFecha}className="opcion-text text-uppercase"/>
                        <div className="opcion-row" ><AiOutlineDown /></div>
                    </button>
                </div>
                {this.state.showCalendar?
                <div className="calendar">
                    <Calendar
                        value = {this.state.fecha}
                        allowPartialRange={true}
                        onChange ={
                            (value)=>{
                                this.props.onChange(value);
                                this.handleChangeFechaFromCalendar(value)
                            }}
                        minDate = {this.props.minDate || null}
                        maxDate = {this.props.maxDate || new Date()}
                    />
                </div>:""}
            </div>
        )
    }
}