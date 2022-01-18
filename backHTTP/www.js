#!/usr/bin/env node

/**
 * Module dependencies.
 */
require('dotenv').config();
var app = require('./app');
var debug = require('debug')('back:server');
var http = require('http');
/**
 * Get port from environment and store in Express.
 */

var port = normalizePort(process.env.PORT || process.env.PORT_USED ||'3500');
app.set('port', port);

/**
 * Create HTTP server.
 */
const server = http.createServer(app);
const io = require("socket.io")(server  , {
  cors: true
});
const devicesNamespace = io.of("/devices");
module.exports.io = io;
module.exports.devicesNamespace = devicesNamespace;
module.exports.server = server;
const usersProcedures = require('./bin/socket-procedures/users');
const chatsProcedures = require("./bin/socket-procedures/chats");
const enviroment = require("./bin/socket-procedures/enviroment");
const messageProcedures = require("./bin/socket-procedures/message");
const enviarEstados = require("./bin/socket-procedures/enviar-estados");
//const devicesProcedures = require("./bin/socket-procedures/devices-procedures");
const { Socket } = require('socket.io');

io.on("connection",  async (socket = Socket)=>{
  await enviroment.sleep(500);
  socket.emit("connected");
  console.log("connected sesion: ", socket.on);
  socket.on("login", usuario=>{
    usersProcedures.login(usuario, socket);
  })
  socket.on("logged-again", usuario=>{
    usersProcedures.relogin(usuario, socket);
  })
  socket.on('list-online-users', (idUsuario)=>{
    usersProcedures.listOnlineUsers(idUsuario, socket);
  })
  socket.on('list-offline-users', (idUsuario)=>{
    usersProcedures.listOfflineUsers(idUsuario, socket);
  })
  socket.on("logout", (idUsuario)=>{
    usersProcedures.logout(idUsuario, socket);
  })
  socket.on("list-chats",userId=>{
    chatsProcedures.listChats(userId, socket);
  })
  socket.on("open-chat", to=>{
    chatsProcedures.openChat(to, socket)
  })
  socket.on("list-chat-messages", idChat=>{
    chatsProcedures.getChatMessages(idChat, socket);
  })
  socket.on("send-message", message=>{
    messageProcedures.sendMessage(message, socket)
  })

  socket.on("cambio-estado", nuevoEstado=>{
    enviarEstados.cambioEstados(nuevoEstado, socket);
  })
  socket.on("obtener-estados", idUsuario=>{
    enviarEstados.obtenerEstados(idUsuario, socket);
  })
  socket.on("check-user", user=>{
    usersProcedures.checkUser(user, socket)
  })
  
});
devicesNamespace.on("connection", async socket =>{
  socket.emit("connected");
  console.log("connected device sesion: ", socket.on);
  socket.on("get-assets", idDevice=>{
    console.log("get-assets correct");
    devicesProcedures.updateDeviceAssets(socket, idDevice)
  })
  socket.on("change-device-id", idDevice=>{
    console.log("change-device-id correct", idDevice);
    // devicesProcedures.updateDeviceAssets(socket, idDevice)
  })
})
/**
 * Listen on provided port, on all network interfaces.
 */

server.listen(port, ()=>{
  console.log("listen on: "+port)
});
server.on('error', onError);
server.on('listening', onListening);

/**
 * Normalize a port into a number, string, or false.
 */

function normalizePort(val) {
  var port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
}

/**
 * Event listener for HTTP server "error" event.
 */

function onError(error) {
  if (error.syscall !== 'listen') {
    throw error;
  }

  var bind = typeof port === 'string'
    ? 'Pipe ' + port
    : 'Port ' + port;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use');
      process.exit(1);
      break;
    default:
      throw error;
  }
}

/**
 * Event listener for HTTP server "listening" event.
 */

function onListening() {
  var addr = server.address();
  var bind = typeof addr === 'string'
    ? 'pipe ' + addr
    : 'port ' + addr.port;
  debug('Listening on ' + bind);
}

