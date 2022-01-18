import React, { Component } from "react";
import {GrClose} from "react-icons/gr";
import {AiOutlineFileAdd, AiOutlineSend} from "react-icons/ai";
import {MdDeleteForever} from "react-icons/md"
import {API} from "../../../enviroment/Credentials";
import moment from "moment";
import "./chat-box.css"

export default class ChatBox extends Component{
    constructor(props){
        super(props);
        this.state ={
            messageList: [],
            minimizeChat: false,
            form : new FormData(),
            uploadedFile: false,
            file: "",
            message: "",
            isFocusedMessage:false,
            isDragging: false
        }
        this.handdleChangeMessageInput = this.handdleChangeMessageInput.bind(this);
        this.handdleFocusInputMessage = this.handdleFocusInputMessage.bind(this);
        this.handdleSelectedFile = this.handdleSelectedFile.bind(this);
        this.handdleClickHeader = this.handdleClickHeader.bind(this);
        this.handdleCloseClick = this.handdleCloseClick.bind(this);
        this.handdleCancelFile = this.handdleCancelFile.bind(this);
        this.handdleDragEnter = this.handdleDragEnter.bind(this)
        this.handdleDragOver = this.handdleDragOver.bind(this)
        this.handdleDragEnd = this.handdleDragEnd.bind(this);
        this.handdleSubmit = this.handdleSubmit.bind(this);
        this.handdleKeyUp = this.handdleKeyUp.bind(this);
        this.handdleDrop = this.handdleDrop.bind(this);
    }
    componentDidMount(){
        // const to = this.props.chat.user1== this.props.id? this.props.chat.user2:this.props.chat.user1;
        this.props.socket.emit("list-chat-messages", this.props.chat.id);
        this.props.socket.on("update-chat-messages-list", messageList=>{
            if(messageList.chatId === this.props.chat.id){
                // console.log("se reciben mensajes del chat: ", this.props.chat.id, "mensajes: ", messageList.messages)
                this.setState({messageList: messageList.messages});
            }
        })
        this.props.socket.on("recive-message", message=>{
            // console.log("recived message:", message);
            if(message.chatId== this.props.chat.id){
                let messages = this.state.messageList;
                messages.push(message);
                this.setState({messageList: messages});
                // console.log("message for this chat: ", this.props.chat.id);
            }
        })
        this.props.socket.on("sended-message", data=>{
            if(data.chatId === this.props.chat.id){
                const message = data.message;
                // console.log("data: ", message);    
                let messages = this.state.messageList;
                // message.file=""
                messages.push(message);
                this.setState({
                    uploadedFile: false,
                    fileName: "",
                    form: new FormData(),
                    message:"",
                    messageList:messages
                })
            }
        })
    }
    handdleClickHeader(){
        this.setState({minimizeChat: !this.state.minimizeChat});
    }
    handdleCloseClick(){
        this.props.closeChat(this.props.chat.id)
    }
    handdleDragEnter(event = new Event()){
        this.setState({
            isDragging: true
        })
    }
    handdleDragOver(event = new Event()){
        event.stopPropagation();
        event.preventDefault();
        this.setState({
            isDragging: true
        })
    }
    handdleDragEnd(event = new Event()){
        // console.log("element leaving: "+ event.target.classList);
        event.stopPropagation();
        event.preventDefault();
        this.setState({
            isDragging: false
        })
    }
    handdleDrop(event = new Event()){
        event.stopPropagation();
        event.preventDefault();
        var data = event.dataTransfer;
        if(data){
            let files = data.files;
            if(files){
                let file = files[0];
                const fileName = Date.now()+file.name;
                const to = this.props.chat.user1== this.props.id? this.props.chat.user2:this.props.chat.user1;
                if(file){
                    let form = new FormData();
                    form.append("fileUploaded", file, fileName);
                    form.append("chatId", this.props.chat.id);
                    form.append("userFromId", this.props.id);
                    form.append("userToId", to);
                    form.append("fileName", file.name);
                    form.append("socket", this.props.socket.id);
                    this.setState({form: form,
                         uploadedFile: true, 
                         fileName: fileName, 
                         message: file.name, 
                         isDragging: false});
                }
            }
        }
    }
    handdleSelectedFile(event){
        let file = event.target.files[0];
        if(file){
            let form = new FormData();
            const to = this.props.chat.user1== this.props.id? this.props.chat.user2:this.props.chat.user1;
            const fileName = Date.now()+file.name;
            form.append("fileUploaded", file,fileName);
            form.append("chatId", this.props.chat.id);
            form.append("userFromId", this.props.id);
            form.append("userToId", to);
            form.append("fileName", file.name);
            form.append("socket", this.props.socket.id);
            this.setState(
                {form: form,
                uploadedFile: true, 
                fileName: fileName, 
                message: file.name
            });
        }
    }
    handdleChangeMessageInput(event){
        if(this.state.uploadedFile){
            this.setState({message: this.state.fileName});
        }else{
            let text = event.target.value;
            this.setState({message: text, file: ""});
        }
    }
    handdleCancelFile(event = new Event()){
        event.preventDefault();
        event.stopPropagation();
        this.setState({
            uploadedFile: false,
            fileName: "",
            form: new FormData(),
            message:""
        })
    }
    handdleFocusInputMessage(isFocused){
        this.setState({isFocusedMessage: isFocused});
        
    }
    async handdleSubmit(){
        // console.log("submit", this.state.message);
        const to = this.props.chat.user1== this.props.id? this.props.chat.user2:this.props.chat.user1;
        let message ={
            content: this.state.message,
            file: undefined, 
            from: this.props.id,
            to: to,
            fecha: new Date(),
            chatId: this.props.chat.id
        }
        let messages = this.state.messageList;
        if(this.state.uploadedFile){
            let options = {
                method: 'POST',
                mode: "cors",
                body: this.state.form 
            }
            let response = await fetch(API.UPLOAD_FILE, options);
            if(response.status !== 500){
                this.setState({
                    uploadedFile: false,
                    file: "",
                    form: new FormData(),
                    message:""
                })
                messages?.push(message);
                this.setState({messageList: messages || []});
            }else{
                console.log("status: ", response.status);
            }
        }else{
            let socket = this.props.socket;
            // console.log("submit content", message);
            socket.emit("send-message", message);
        }
    }
    handdleKeyUp(event){
        if(event.key === "Enter"){
            this.handdleSubmit();
        }
    }
    componentDidUpdate(){
        let lastMessage = document.querySelector(`#message-chat-${this.props.chat.id}-${this.state.messageList.length}`);
        lastMessage?.scrollIntoView();
    }
    render(){
        let users = this.props.onlineUsers.concat(this.props.offlineUsers);
        let userTo = users.find(usr=>(usr.userId == this.props.chat.user2 || 
                            usr.userId == this.props.chat.user1)
                            && usr.userId!= this.props.id);
        if(userTo != undefined)
        return(
            <div className={`chat-box ${this.state.minimizeChat?"minimized":"   "}`} onDragStart={this.handdleDragEnter} onDropCapture={this.handdleDrop} onDragLeaveCapture={this.handdleDragEnd} onDragOverCapture={this.handdleDragOver}>
                <div onClick={this.handdleClickHeader} className="chat-box-header d-flex flex-row align-items-center">
                    <img className ="chat-header-user-photo"src={userTo?.userPhoto? userTo.userPhoto: this.props.dfUser} alt="" /> 
                    <div className="name-close-header d-flex justify-content-end w-100 align-items-center">
                        <h3 className="chat-header-user-name">{userTo?.userFullName || userTo?.userName}</h3> 
                        <div className="icon" onClick= {this.handdleCloseClick}>
                            <GrClose />
                        </div>
                    </div>

                </div>
                {!this.state.minimizeChat?
                <div className="" >
                    <div className="chat-item-body">
                        {
                        this.state.isDragging?
                        <AiOutlineFileAdd />:
                        <div className="chat-item-body messages">
                            {
                                this.state.messageList?.map((message, index)=>{
                                    const isSend = message.from == this.props.id;
                                    // console.log("message#", index, ": ", message);
                                    return (
                                    <div key={index} id={`message-chat-${this.props.chat.id}-${index+1}`} className={`message-item ${isSend?"send":"recived"}`}>
                                        <div className={`message-item-cell ${isSend?"send":"recived"}`}>
                                            <p className="message-item-content">
                                                {message.file!=null || message.file!=undefined?
                                                <a className="file-download" rel="noreferrer" target="_blank" href={`${API.GET_FILE}/${message.file}`}>{message.content}</a>
                                                :
                                                message.content}
                                            </p>
                                            <p className="message-item-date">
                                                {moment(message.fecha).format("hh:MM:ss")}
                                            </p>
                                        </div>
                                    </div>)
                                })
                            }
                        </div>
                        }
                    </div>
                    <div className="message-box d-flex align-items-center m-0 h-100">
                            <label htmlFor="inputFile" className="file-icon">
                                {
                                    this.state.uploadedFile?
                                    <div className="delete-button file-icon" onClick={this.handdleCancelFile}>
                                        <MdDeleteForever />
                                    </div>:
                                    <AiOutlineFileAdd />
                                }
                            </label>
                            {this.state.uploadedFile?"": 
                                <input type="file" className={`inputFileObj`} name="inputFile" id="inputFile" onChange={this.handdleSelectedFile}/>
                            }
                            <input className={`input-message${this.state.isFocusedMessage?" focused":""}`} onFocus={()=>this.handdleFocusInputMessage(true)} 
                            onBlur={()=>this.handdleFocusInputMessage(false)} autoComplete={"off"} autoCapitalize={"off"} disabled={this.state.uploadedFile} type="text" name="message-content" id="" onChange={this.handdleChangeMessageInput} value ={this.state.message} onKeyUp={this.handdleKeyUp}/>
                            <div className="icon send" onClick={this.handdleSubmit}>
                                <AiOutlineSend />
                            </div>
                    </div>
                </div>
                :""}
            </div>
        )
        else {
            console.log("no se encontró el chat abierto con: ", this.props.chat.user2)
            return(<div />)
        }
    }
}