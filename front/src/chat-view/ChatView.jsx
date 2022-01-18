import React, {Component} from "react";
import "./chat-view.css"; 
import ChatsListView from "./chats-list-view/ChatsListView.jsx";
import OnlineUsersView from "./online-users-view/OnlineUsersView.jsx";
import ChatsOpenedView from "./chats-opened-view/ChatsOpenedView.jsx";


export default class ChatView extends Component{
    constructor(props){
        super(props)
        this.state = {
            chats:[],
            isConnected: false,
            openedChats: JSON.parse(localStorage.getItem("opened-chats-"+this.props.id)) || [],
            onlineUsers: [],
            offlineUsers: []
        }
        this.handdleNewChat = this.handdleNewChat.bind(this);
        this.hanndleSetOnlineUsers = this.hanndleSetOnlineUsers.bind(this);
        this.hanndleSetOfflineUsers = this.hanndleSetOfflineUsers.bind(this);
        this.handdleSetOpenedChats = this.handdleSetOpenedChats.bind(this);
        this.handdleSetChats= this.handdleSetChats.bind(this);
        this.handleCloseChat = this.handleCloseChat.bind(this);
        this.recoverOpenedChats = this.recoverOpenedChats.bind(this);
    }
    componentDidMount(){
        // this.props.socket.on("error-open-chat", ()=>{
        //     console.log("error al abrir el chat");
        //     this.props.socket.emit("open-chat",{from: this.props.id, to: userID});
        // })
        this.props.socket.on("chat-opened", chatOpened=>{
            if(this.state.openedChats.some(chat=> chat.id === chatOpened.id)){
                // console.log("chat abierto: ",chatOpened);
                return 0; 
            }
            const chat = {
                id: chatOpened.id,
                user1: chatOpened.from,
                user2: chatOpened.to
            }
            // console.log("chat se acaba de abrir: ", chat);
            let chats = this.state.openedChats;
            chats.push(chat);
            if(chats.length>4){
                chats.shift();
            }            
            localStorage.setItem("opened-chats-"+this.props.id, JSON.stringify(chats));
            console.log("se añade un nuevo chat");
            console.log("chats abiertos: ", chats)
            this.setState({openedChats: chats});
        })
        this.recoverOpenedChats();
    }
    
    recoverOpenedChats(){
        // const chats = this.state.openedChats;
        
    }

    handdleNewChat(userID){
        if(this.state.openedChats.some(chat=> chat.from == userID || chat.to == userID)){
            // console.log("chat abierto: ",chatOpened);
            return 0; 
        }
        this.props.socket.emit("open-chat", {from: this.props.id, to: userID});
        
    }
    hanndleSetOnlineUsers(onlineUsers){
        this.setState({onlineUsers: onlineUsers});
    }
    hanndleSetOfflineUsers(onffineUsers){
        this.setState({offlineUsers: onffineUsers});
    }
    handdleSetOpenedChats(openedChatList){
        this.setState({openedChats: openedChatList});
    }
    handdleSetChats(chats){
        // console.log("new chats: ", chats);
        this.setState({chats: chats});
    }
    handleCloseChat(chatId){
        let openedChats = this.state.openedChats;
        openedChats = openedChats?.filter(chat=>chat.id != chatId)
        localStorage.setItem("opened-chats", JSON.stringify(openedChats));
        this.setState({openedChats: openedChats});
    }

    render(){
        return(
                <div className="row d-flex flex-row chat-view">
                        <div className="row d-flex flex-column chat-left-bar">
                            <div className="line-users d-flex flex-column">
                                <OnlineUsersView 
                                    dfUser = {this.props.dfUser}
                                    socket={this.props.socket} 
                                    id = {this.props.id} 
                                    handdleNewChat={this.handdleNewChat}
                                    onlineUsers = {this.state.onlineUsers}
                                    offlineUsers = {this.state.offlineUsers}
                                    setOnlineUsers= {this.hanndleSetOnlineUsers}
                                    setOfflineUsers= {this.hanndleSetOfflineUsers}/>
                            </div>
                            <div className="chats-list">
                                <ChatsListView dfUser = {this.props.dfUser}
                                    socket={this.props.socket} 
                                    id = {this.props.id} 
                                    handdleNewChat={this.handdleNewChat}
                                    onlineUsers = {this.state.onlineUsers}
                                    offlineUsers = {this.state.offlineUsers}
                                    setChats= {this.handdleSetChats}
                                    chats={this.state.chats}
                                    />
                            </div>
                            
                        </div>
                    <div className="chat-body d-flex align-items-end">
                            <ChatsOpenedView 
                                 dfUser = {this.props.dfUser}
                                 socket={this.props.socket} 
                                 id = {this.props.id} 
                                 openedChats ={this.state.openedChats}
                                 setOpenedChats = {this.handdleSetOpenedChats}
                                 onlineUsers = {this.state.onlineUsers}
                                 offlineUsers = {this.state.offlineUsers}
                                 closeChat = {this.handleCloseChat}
                            />
                    </div>
                </div>
        )
    }
}