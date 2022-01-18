import React, {Component} from "react";
import "./online-users-view.css";
import defaulUser from "../../assets/img/df-user.png";

export default class OnlineUsersView extends Component{
    constructor(props){
        super(props);
        this.getUsers = this.getUsers.bind(this);
    }
    componentDidMount(){
        this.getUsers();
    }
    getUsers(){
        this.props.socket.on("logged",()=>{
            this.props.socket.emit("list-online-users", this.props.id);
        })
        this.props.socket.on("list-online-users", usersOnline=>{
            let onlineUsers = usersOnline.filter(usuario=>usuario.userId!=this.props.id);
            this.props.setOnlineUsers(onlineUsers);
            this.props.socket.emit("list-offline-users");
        })
        this.props.socket.on("error-list-offline-users", ()=>{
            console.log("error al consultar los usarios offline");
            this.props.socket.emit("list-offline-users");
        })
            
        this.props.socket.on("update-offline-user-list", usuariosOffline=>{
            const offlineUsers = usuariosOffline.filter(usuario=>usuario.userId!=this.props.id);
            this.props.setOfflineUsers(offlineUsers);
        })
        this.props.socket.on("update-user-list", ()=>{
            this.props.socket.emit("list-online-users", this.props.id);
        })
    }
    render(){
        return(
            <div className="online-users-view d-flex flex-column">
                <h1 className="online-users-title text-center ">Usuarios en línea</h1>
                {this.props?.onlineUsers?.map((user, index) => {
                  return (
                        <div onClick={()=>this.props.handdleNewChat(user.userId)}  key = {index} className="item-users-list online-user d-flex flex-row align-items-center">
                            <img className ="user-online-photo"src={user.userPhoto? user.userPhoto: defaulUser} alt="" /> 
                            <h3 className="online-user-name">{user.userFullName}</h3> 
                        </div>
                  )
                })}
                <h5 className=" offline-users-title text-center">Usuarios desconectados</h5>
                {this.props?.offlineUsers?.map((user, index) => {
                  return (
                        <div onClick={()=>this.props.handdleNewChat(user.userId)} key = {index} className="item-users-list offline-user d-flex flex-row align-items-center">
                            <img className ="user-online-photo"src={user.userPhoto? user.userPhoto: defaulUser} alt="" /> 
                            <h3 className="online-user-name">{user.userFullName}</h3> 
                        </div>
                  )
                })}
            </div>
        )
    }
}

