import React, {Component} from "react"
import "./chats-view.css"
import moment from "moment";
import notificacion from "../../assets/sounds/notificacion.mp3";

export default class ChatsListView extends Component{
    constructor(props){
        super(props);
        this.state ={
            chats: this.props.chats,
            ring: new Audio()
        }
        this.getChatList = this.getChatList.bind(this);
        this.handleClickChat= this.handleClickChat.bind(this);
        this.setAudio =this.setAudio.bind(this)
    }
    componentDidMount(){
        this.getChatList();
        this.setAudio()
    }
    setAudio(){
        const ring = new Audio(notificacion);
        ring.volume = 0.5;
        this.setState({
            ring: ring
        })
    }
    getChatList(){
        this.props.socket.emit("list-chats", this.props.id);
            // console.log("listing chats");
        console.log("se pone la lista de chats");
        this.props.socket.on("list-chats",chats=>{
            this.props.setChats(chats);     
            this.setState({chats: chats});
            console.log("se actualizan chats", this.state.chats);
        })
        this.props.socket.on("update-chats-list",()=>{
            // console.log("se actualiza el chatList");
            this.props.socket.emit("list-chats", this.props.id);
        });
        // this.props.socket.on("error-list-chats",()=>{
        //     this.props.socket.emit("list-chats", this.props.id);
        // })
        this.props.socket.on("update-last-message", data=>{
            const chats = this.props.chats || [];
            const indexChat = chats.findIndex(chat=> chat.id == data.chatId);
            if (indexChat!== -1){
                chats[indexChat].lastMessage = data.message;
                this.props.setChats(chats)
                this.setState({chats:chats})
            }else{
                console.log("no se encontró el chat");
            }
        })
        this.props.socket.on("update-last-reviced-message", message=>{
            this.state.ring.play();
            const chats = this.props.chats || [];
            let indexChat = chats.findIndex(chat=> chat.id==message.chatId);
            if(indexChat !== -1 ){
                console.log("new message from listed chat: ", chats[indexChat]);
                chats[indexChat].lastMessage = message;
                chats[indexChat].isOpened = false;
            }else{
                // console.log("new chat: ", message);
                chats.unshift({
                    id: message.chatId,
                    lastMessage: {
                        content: message.content,
                        file: message.file, 
                        from: message.from,
                        to: message.to,
                        fecha: message.fecha
                    },
                    isOpened:false,
                    otherUser: message.from
                });
            }
            this.props.setChats(chats);
            this.setState({chats: chats})
        })
    }
    handleClickChat(index){

    }
    render(){
        return(
            <div className="chats-view  d-flex flex-column">
                <div className="title-chats-view">
                    Chats
                </div>
                <div className="body-chats-view ">
                    {
                        this.state.chats?.map((chat, index)=>{
                            // console.log("chat: ", chat);
                            const onlineUsers = this.props.onlineUsers || [];
                            const offlineUsers = this.props.offlineUsers || [];
                            const users = onlineUsers.concat(offlineUsers);
                            // console.log("usuarios: ", users);
                            const user = users.find(usr=>usr.userId == chat.otherUser);
                            if(user != undefined){
                                const message = chat.lastMessage;
                                const fecha = message?.fecha;
                                if(message&&message?.content!= null){
                                    return(
                                        <div onClick={()=>this.props.handdleNewChat(user.userId)}  key = {index} className={"item-chat-list d-flex flex-row align-items-center "+(chat.isOpened?"":"not-open")}>
                                            <img className ="chat-user-photo"src={user.userPhoto? user.userPhoto: this.props.dfUser} alt="" /> 
                                            <div className="item-chat-body d-flex flex-column">
                                                <h3 className="item-chat-user-name">{user.userFullName}</h3> 
                                                <p className="item-chat-last-message">
                                                    {message.from == this.props.id? "Tu: ":""}
                                                    {message.file != null || message.file != undefined || message.file?.length >0 ?
                                                    `file: ${message.content}`
                                                    :
                                                    message.content
                                                    }
                                                    </p>
                                                
                                            </div>
                                            <div className="item-chat-date-container">
                                                    <p className="item-chat-date">{moment(fecha).format("DD/MM hh:MM:ss")}</p>
                                            </div>
                                        </div>
                                    )
                                } 
                            }
                                return(
                                    ""
                                )
                        })
                    }
                </div>
            </div>
        )
    }
}