import React, {Component} from "react";
import ChatBox from "./chat-box/ChatBox";
import "./chats-opened-view.css"


export default class ChatsOpenedView extends Component{

    constructor(props){
        super(props);
    }
    render(){
        return(
            <div className="chats-opened-view d-flex justify-content-end align-items-end">
                {
                    this.props.openedChats?.map((chatItem, index)=>{
                        return (<ChatBox
                            id = {this.props.id}
                            dfUser = {this.props.dfUser}
                            key = {index}
                            socket = {this.props.socket}
                            chat= {chatItem}
                            onlineUsers = {this.props.onlineUsers}
                            offlineUsers = {this.props.offlineUsers}
                            closeChat = {this.props.closeChat}
                        />)
                    })
                }
            </div>
        )
    }
}