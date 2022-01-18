import React, { Component } from "react";
import { CircleMenuItem } from "react-circular-menu";
import styled, {keyframes}from "styled-components";
import { fadeIn } from "react-animations";
import {AiOutlineClose} from "react-icons/ai";
import {CgArrowsExpandUpLeft} from "react-icons/cg"

import "./menu.css"
import { Image } from "react-bootstrap";

const buttonAnimation = keyframes`${fadeIn}`;
const ButtonFade = styled.button`
                    padding: 0 !important;
                    background-color:rgba(0,0,0,0);
                    border:none;
                    animation: .5s ${buttonAnimation};
                    `
export default class Menu extends Component{
    constructor(props){
        super(props)
        
        this.state={
            menuIsToggled: false
        }
        this.handleMenuToggle = this.handleMenuToggle.bind(this)
    }
    
    handleMenuToggle(){
        this.setState({menuIsToggled: !this.state.menuIsToggled});
    }
    render() {
        const {imgBtnChatBot, imgBtnClose, imgBtnOpen, imgBtnPromocion, imgBtnRecetas} = this.props.campania ??{}
        return (
            <div className="menu">
                <div className="menu-center" onClick={this.handleMenuToggle}>
                    {

                        this.state.menuIsToggled?
                        
                        imgBtnOpen?
                        <Image 
                            height="4em" 
                            width="4em"
                            src={imgBtnOpen}
                            alt="No se puede cargar la imagen del boton de abrir"
                            />
                        :
                        <ButtonFade className="menu-center" ><CgArrowsExpandUpLeft size="4em"/></ButtonFade>
                        :
                        imgBtnClose?
                        <Image 
                            height="4em" 
                            width="4em"
                            src={imgBtnClose}
                            alt="No se puede cargar la imagen del boton de cerrar"
                            />
                        : 
                        <ButtonFade className="menu-center" ><AiOutlineClose size="4em"/></ButtonFade>
                    }
                </div>
                    <CircleMenuItem
                    className="no-padding no-border"
                        menuActive = {this.state.menuIsToggled}
                        radius={8}
                        rotationAngle={270}
                        size={4}
                        onClick={()=>{
                                this.props.onChangeVista(3);
                                this.setState({menuIsToggled: false});
                            }}
                        >
                        {imgBtnRecetas?
                        <Image 
                            className="icono-menu"
                            height="100%" 
                            width="100%"
                            src={imgBtnRecetas}
                            alt="No se puede cargar la imagen del boton de recetas"
                            />
                        : "Recetas"}
                    </CircleMenuItem>
                    <CircleMenuItem
                    className="no-padding no-border"
                        menuActive = {this.state.menuIsToggled}
                        radius={8}
                        rotationAngle={225}
                        size={4}
                        onClick={()=>{
                            this.props.onChangeVista(4);
                            this.setState({menuIsToggled: false}); 
                        }}
                        >
                        {imgBtnChatBot ?
                        <Image 
                            className="icono-menu"
                            height="100%" 
                            width="100%"
                            src={imgBtnChatBot}
                            alt="No se puede cargar la imagen del boton del chatbot"
                            />
                        : "ChatBot"}
                    </CircleMenuItem>
                    <CircleMenuItem
                    className="no-padding no-border"
                        menuActive = {this.state.menuIsToggled}
                        radius={8}
                        rotationAngle={180}
                        size={4}
                        onClick={()=>{
                            this.props.onChangeVista(5);
                            this.setState({menuIsToggled: false});
                        }}
                        >
                        {imgBtnPromocion ?
                        <Image 
                            className="icono-menu"
                            height="100%" 
                            width="100%"
                            src={imgBtnPromocion}
                            alt="No se puede cargar la imagen del boton de promociones"
                            />
                        : "Promoción"}
                    </CircleMenuItem>
                </div>
        )
    }
}