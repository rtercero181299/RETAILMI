
const { Socket } = require('socket.io');
const {Request,TYPES}=require('tedious');
const enviroment = require('./enviroment')
const {io} = require('../../www');
let usersOnline = enviroment.userOnline;
let usersOffline = enviroment.userOffline;
const sleep = enviroment.sleep;
module.exports.login=async (usuario, socket = Socket)=>{
    let conection = await require('../../conection');
    // console.log("new connected: ", usuario)
    if(!usersOnline.some(userCheck => userCheck.userName== usuario.userName)){
        try { 
          const query = new Request("ConsultarUsuario", async(error)=>{
            if(error){
              if (error.code === 'EINVALIDSTATE'|| error.code =="ESOCKET"){
                console.log("error de conexión al hacer la consulta del usuario: ", usuario.userName);
                await sleep(1000);
                try {
                  conection = await require('../../conection');
                } catch (errorConection) {
                  console.log("error de conexión al intentar reiniciar");
                }
              }else{
                console.log("error en la consulta de usuario : "+ usuario.userName+" error:", error.code);
              }
              await sleep(1000);
              socket.emit("error-login");
            }
          })
          query.addParameter("nombreUsuario", TYPES.NVarChar, usuario.userName);
          query.addParameter("password", TYPES.NVarChar, usuario.password);
          let user;
          query.on("row", (row)=>{
            if(row.length>0)
              user = {
                userId: row[0].value,
                userName: row[1].value, 
                userFullName : row[2].value,
                vccId: row[3].value,
                campaniaId: row[4].value,
                supervisorId: row[5].value, 
                userPhoto: row[6].value, 
                tipoUsuario: row[7].value,
                socket: socket.id
              };
          })
          query.on("doneProc", async ()=>{
            if(user){

              // console.log("se logea usuario", user.userName);
              usersOnline.push(user);
              let indexOffline = usersOffline.findIndex(usr=>usr.userId == user.userId);
              if(indexOffline!==-1){
                usersOffline.splice(indexOffline, 1);
              }
              socket.emit("logged", user);
              io.emit('update-user-list');
              socket.emit("update-chat-list");
              socket.emit("correct-login")
            }else{
                socket.emit("incorrect-login")
            }
            })
          try {
              conection.callProcedure(query);
          } catch (error) {
              console.log("error en la conexión: ", error.message);
          }
        } catch (error) {
            console.log("error en la query: ", error);
          }
      }else{
        let user = usersOnline.find(user=>user.userName === usuario.userName);
        user.socket = socket.id;
        let indexOffline = usersOffline.findIndex(usr=>usr.userId == user.userId);
        if(indexOffline!==-1){
          usersOffline.splice(indexOffline, 1);
        }
        console.log("se inicia correctamente la sesión del usuario: ", user.userName)
        await sleep(500)
        socket.emit("logged", user);
        io.emit('update-user-list');
      }
    }
  module.exports.relogin = async (usuario, socket= Socket)=>{
    // console.log("offline users:", usersOffline);
    let user = usersOnline.find(user=>user.userId === usuario.userId);
    let indexOffline = usersOffline.findIndex(usr=>usr.userId == usuario.userId);
    if(indexOffline!==-1){
      usersOffline.splice(indexOffline, 1);
    }
    if(user){
      user.socket = socket.id;
      console.log("se inicia correctamente la sesión del usuario: ", user)
    }else{
      usuario.socket = socket.id;
      usersOnline.push(usuario);
      console.log("se inicia correctamente de nuevo la sesión del usuario: ", usuario)
    }
    await sleep(500)
    socket.emit("logged", user);
    io.emit('update-user-list');
}
module.exports.listOnlineUsers = async (idUsuario, socket = Socket)=>{
    let otherUsers = usersOnline.filter(user=> !(user.userId=== idUsuario))
    // console.log("usuarios en linea: ", usersOnline);
    await sleep(500),
    socket.emit('list-online-users', otherUsers);
  }
module.exports.listOfflineUsers = async (idUsuario, socket = Socket)=>{
    // console.log("usuarios no en linea: ", usersOffline);
    socket.emit('update-offline-user-list', usersOffline);
}
module.exports.logout=(idUsuario, socket = Socket)=>{
    console.log("usuarios actuales: ", usersOnline);
    usersOnline = usersOnline.filter(user=> !(user.userId === idUsuario));
    console.log("se cierra la sesión de: "+ idUsuario, "usuarios restantes: ", usersOnline);
    socket.broadcast.emit('update-user-list');
}
module.exports.checkUser= async(user, socket)=>{
    let conection = await require('../../conection')
    try { 
      const query = new Request("ConsultarExisteUsuario", async(error)=>{
        if(error){
          if (error.code === 'EINVALIDSTATE'|| error.code =="ESOCKET"){
            console.log("error de conexión al hacer la existencia del usuario: ", user);
            await sleep(1000);
            try {
              conection = await require('../../conection');
              await sleep(500)
              conection.callProcedure(query);
            } catch (errorConection) {
              console.log("error de conexión al intentar reiniciar");
            }
          }else{
            console.log("error en la consulta de usuario : "+ user+" error:", error.code);
          }
          await sleep(1000);
        }
      })
      query.addParameter("nombreUsuario", TYPES.NVarChar, user);
      let userResp;
      query.on("row", (row)=>{
        userResp = row[0].value
      })
      query.on("doneProc", ()=>{
        if(userResp){
            socket.emit("user-exist")
        }else{
            socket.emit("user-not-exist")
        }
        })
      try {
          conection.callProcedure(query);
      } catch (error) {
          console.log("error en la conexión: ", error.message);
      }
    } catch (error) {
        console.log("error en la query: ", error);
      }
}