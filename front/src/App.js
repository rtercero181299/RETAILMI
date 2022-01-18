
import React, { Component} from "react";
import {
  HashRouter as Router,
  Route, Switch
} from "react-router-dom"
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
//components
import Home from "./Home/Home";
import NavbarCsm from "./Navbar/Navbar.jsx";
import Login from "./Login/Login.jsx"


export default class App extends Component{
  constructor(props){
    super(props);
    const user = JSON.parse(localStorage.getItem("usr"));
    this.state ={
      // isLogged: user?.isLogged == "true",
      isLogged:true,
      tipoUsuario: user?.tipoUsuario || 0,
      nombre: user?.nombre || "",
      id: user?.tipoUsuario || 0
    }
    this.setUserInfo = this.setUserInfo.bind(this)
  }
  setUserInfo(user){
    localStorage.setItem("usr", JSON.stringify(user))
    this.setState({...user});
  }

  render(){
    return(
      <Router>
        <NavbarCsm  isLogged={this.state.isLogged}/>
        <Switch>
          <Route exact path="/" render={(props)=>{
            return(
              <Home
                {...props}
                isLogged ={this.state.isLogged}
              />
            )
          }
          }/>
          <Route exact path="/login" render={(props)=>{
            return(
              <Login
                {...props}
                isLogged ={this.state.isLogged}
                setUserInfo={this.setUserInfo}
              />
            )
          }
          }/>
        </Switch>
        <link
            rel="stylesheet"
            href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.1/dist/css/bootstrap.min.css"
            integrity="sha384-F3w7mX95PdgyTmZZMECAngseQB83DfGTowi0iMjiWaeVhAn4FJkqJByhZMI3AhiU"
            crossOrigin="anonymous"
          />
      </Router>
    )
  }
}
