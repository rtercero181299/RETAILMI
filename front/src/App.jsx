import React, { Component } from 'react';
import io  from 'socket.io-client';
import {
  HashRouter as Router,
  Route,
  Switch
} from "react-router-dom"
//estilos
import './App.css';
//variables de entorno
import { urlAPI } from "./enviroment/Credentials";
//assets
// import dfUser from "./assets/img/df-user.png";
//componentes
// import ChatView from './chat-view/ChatView.jsx';
import Login from './Login/Login.jsx';
import Logout from './Logout/Logout.jsx';
import Register from './Register/User/register.jsx';
import RegisterCompany from './Register/Company/RegisterCompany';
import Home from "./Home/Home.jsx";
import Navbar from './Navbar/Navbar.jsx';
import Modify from './Modify/User/Modify.jsx';
import Sidebar from './Sidebar/Sidebar';
import Delete from './Delete/User/Delete';
import HomeCSM from './home-csm/HomeCSM';
import LoadingSpinner from './loading-spinner/LoadingSpinner';
/**
 * @author @AmelieCruz
 * Componente principal el cual define el routeo de la página
 */
class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      socket: undefined,
      isLogged: localStorage.getItem("isLogged") == "true",
      userId: "",
      userName: "",
      userFullName: "",
      vccId: "",
      campaniaId: "",
      supervisorId: "",
      userPhoto: "",
      tipoUsuario: "",
      isConnected: false
    }
    this.getSocketConection = this.getSocketConection.bind(this);
    this.setUserInfo = this.setUserInfo.bind(this);
    this.setIsLogged = this.setIsLogged.bind(this);
    this.getUserInfoIfPosible = this.getUserInfoIfPosible.bind(this);
  }
  componentDidMount() {
    this.getSocketConection();
  }
  getSocketConection() {
    const socket = io(urlAPI);
    this.setState({ socket: socket });
    socket.connect();
    let isConected = false;
    let countDiscon = 0;
    socket.on("connected", () => {
      // console.log("connected");
      countDiscon = 0;
      isConected = true;
      this.getUserInfoIfPosible();
      this.setState({ isConnected: true });
    })
    socket.on("disconnect", () => {
      isConected = false;
      setTimeout(() => {
        if (!isConected) {
          countDiscon++;
          console.error("disconected");
          if(countDiscon>10){
            this.setState({ isConnected: false });
          }
        }
      }, 500);
    })
  }
  getUserInfoIfPosible() {
    if (this.state.isLogged) {
      const user = JSON.parse(localStorage.getItem("userInfo"));
      // console.log("is logged: ", user);
      this.setState({
        userId: user?.userId,
        userName: user?.userName,
        userFullName: user?.userFullName,
        vccId: user?.vccId,
        campaniaId: user?.campaniaId,
        supervisorId: user?.supervisorId,
        userPhoto: user?.userPhoto,
        tipoUsuario: user?.tipoUsuario,
      });
      this.state.socket?.emit("logged-again", user);
    }
  }
  setUserInfo(user) {
    if (user != undefined) {
      // console.log("usu ario",user);  
      const userInfo = {
        userId: user?.userId,
        userName: user?.userName,
        userFullName: user?.userFullName,
        vccId: user?.vccId,
        campaniaId: user?.campaniaId,
        supervisorId: user?.supervisorId,
        userPhoto: user?.userPhoto,
        tipoUsuario: user?.tipoUsuario,
      }
      this.setState(userInfo);
      localStorage.setItem("userInfo", JSON.stringify(userInfo));
    }
  }
  setIsLogged(value) {
    // console.log("change isLogged", value);
    this.setState({ isLogged: value })
    localStorage.setItem("isLogged", value);
  }
  render() {
    if (!this.state.isConnected)
      return (<LoadingSpinner></LoadingSpinner>)

    return (
      <Router>
        <Navbar
          isLogged={this.state.isLogged}
          tipoUsuario={this.state.tipoUsuario} />
        <Sidebar
          isLogged={this.state.isLogged}
          tipoUsuario={this.state.tipoUsuario} />
        <div className="d-flex flex-row body-all ">
          <div className={this.state.isLogged ? "vistas" : "no-chat"}>
            <Switch>
              <Route exact path="/login" render={(props) => <Login
                {...props}
                socket={this.state.socket}
                isLogged={this.state.isLogged}
                setIsLogged={this.setIsLogged}
                setUserInfo={this.setUserInfo} />} />
              <Route exact path="/register-user" render={(props) => <Register
                socket={this.state.socket}
                tipoUsuario={this.state.tipoUsuario}
                isLogged={this.state.isLogged}
                title={"Registrar"}
                isEditable={true}
                id={this.state.userId}
                idVcc={this.state.vccId}
              />} />
              <Route exact path="/modify-user" render={(props) => <Modify
                idVcc={this.state.vccId}
                socket={this.state.socket}
                tipoUsuario={this.state.tipoUsuario}
                isLogged={this.state.isLogged}
                id={this.state.userId}
              />} />
              <Route exact path="/delete-user" render={(props) => <Delete
                idVcc={this.state.vccId}
                socket={this.state.socket}
                tipoUsuario={this.state.tipoUsuario}
                isLogged={this.state.isLogged}
                id={this.state.userId}
              />} />
              <Route exact path="/register-company" render={(props) => <RegisterCompany
                socket={this.state.socket}
                tipoUsuario={this.state.tipoUsuario}
                isLogged={this.state.isLogged}
                title={"Registrar"}
                isEditable={true}
                id={this.state.userId}
                idVcc={this.state.vccId}
              />} />
              <Route exact path="/modify-company" render={(props) => <Modify
                idVcc={this.state.vccId}
                socket={this.state.socket}
                tipoUsuario={this.state.tipoUsuario}
                isLogged={this.state.isLogged}
                id={this.state.userId}
              />} />
              <Route exact path="/view-experience" render={(props) => <HomeCSM
                socket={this.state.socket}
                tipoUsuario={this.state.tipoUsuario}
                isLogged={this.state.isLogged}
                title={"Registrar"}
                isEditable={true}
                id={this.state.userId}
                idVcc={this.state.vccId}
                {...props}
              />} />
              <Route exact path="/delete-user" render={(props) => <Delete
                idVcc={this.state.vccId}
                socket={this.state.socket}
                tipoUsuario={this.state.tipoUsuario}
                isLogged={this.state.isLogged}
                id={this.state.userId}
              />} />
              <Route exact path="/logout" render={(props) => {
                return <Logout
                  {...props}
                  socket={this.state.socket}
                  id={this.state.userId}
                  setIsLogged={this.setIsLogged}
                  setUserInfo={this.setUserInfo} />
              }} />
              <Route exact path="/" render={(props) => {
                return <Home
                  {...props}
                  userName={this.state.userFullName}
                  id={this.state.userId}
                  socket={this.state.socket}
                  tipoUsuario={this.state.tipoUsuario}
                  isLogged={this.state.isLogged}
                />
              }
              } />

            </Switch>
          </div>

          {/* {this.state.isLogged?
            <ChatView 
              id={this.state.userId} 
              dfUser = {dfUser} 
              socket = {this.state.socket}/>
            :
            ""
          } */}
        </div>
      </Router>
    );
  }
}
export default App;
