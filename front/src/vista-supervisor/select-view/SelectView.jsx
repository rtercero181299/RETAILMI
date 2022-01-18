import React, {Component} from "react";
import {AiOutlineDown} from "react-icons/ai";
import $ from "jquery";
import "./select-view.css";

export default class SelectView extends Component{
    constructor(props){
        super(props)
        this.state ={
            selectedView: this.props.options[0],
            isSelecting: false
        }
        this.handleClickSelectBox = this.handleClickSelectBox.bind(this);
        this.handleClickOption= this.handleClickOption.bind(this);
        this.setEvents = this.setEvents.bind(this);
    }
    componentDidMount(){
        this.setEvents();
    }
    setEvents(){
        $("body").on("click",()=>{
            this.setState({isSelecting:false})
        })
    }
    handleClickSelectBox(event){
        event.preventDefault();
        this.setState({isSelecting: !this.state.isSelecting});
        event.stopPropagation();
    }
    handleClickOption(option){
        this.setState({selectedView: this.props.options[option-1]})
        this.props.onChange(option);
    }
    render(){
        return(
            <div className="select-view">
                <div className="select-option-box">
                    <label className="label-select">{`${this.props.title}`}</label>
                    <div className="select-box" onClick={this.handleClickSelectBox}>
                        <p className="text-center option-selected">
                            {this.state.selectedView}
                        </p>
                        <p className="arrow">
                            <AiOutlineDown/>
                        </p>
                    </div>
                </div>
                {
                    this.state.isSelecting?
                    <div className="view-options">  
                        {this.props.options?.map((option, index)=>{
                            return <p
                             key={index}
                             className="option text-center pt-1"
                             onClick={()=>this.handleClickOption(index+1)}
                             >{option}</p>
                        })}
                    </div>
                    :""
                }
            </div>
        )
    }
}